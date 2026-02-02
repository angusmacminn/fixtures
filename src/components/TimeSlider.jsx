import { motion } from "motion/react";
import { useState, useRef } from "react";
import styles from "@/styles/TimeSlider.module.scss";

export default function TimeSlider({ minute, onChange }) {
    const [isDragging, setIsDragging] = useState(false);

    const rafRef = useRef(null);
    const latestRef = useRef({ clientX: 0, rect: null });

    const handleMouseMove = (e) => {
        if (!isDragging && e.buttons !== 1) return;

        latestRef.current = {
            clientX: e.clientX,
            rect: e.currentTarget.getBoundingClientRect()
        };

        if (rafRef.current) return; // Already scheduled for this frame

        rafRef.current = requestAnimationFrame(() => {
            const { clientX, rect } = latestRef.current;
            const x = clientX - rect.left;
            const percent = Math.max(0, Math.min(1, x / rect.width));
            const clickedMinute = Math.round(percent * 90);
            onChange(clickedMinute);
            rafRef.current = null;
        });
    };
    
    const handleClick = (clickedMinute) => {
        if (isDragging) return;
        onChange(clickedMinute);
    };
    


    // For each line, calculate if it should be tall/medium/short
    const height = (lineMinute) => {
        const distance = Math.abs(lineMinute - minute);
        if (distance === 0) return 28; // Selected
        if (distance === 1) return 16; // Adjacent
        if (distance === 2) return 12; // Second adjacent
        if (distance === 3) return 8; // Third adjacent
        if (distance === 4) return 4; // Fourth adjacent
        if (distance >= 1) return 1; // Fifth and beyond
        return 8; // Default
    };

    return (
        <div className={styles.sliderWrapper}>
            <div 
                className={styles.timeSlider}
                onMouseDown={(e) => {
                    setIsDragging(true);
                    handleMouseMove(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={() => {
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                    setIsDragging(false);
                }}
                onMouseLeave={() => {
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                    setIsDragging(false);
                }}
                onTouchStart={(e) => {
                    setIsDragging(true);
                    const touch = e.touches[0];
                    if (touch) handleMouseMove({ clientX: touch.clientX, currentTarget: e.currentTarget });
                }}
                onTouchMove={(e) => {
                    const touch = e.touches[0];
                    if (touch) handleMouseMove({ clientX: touch.clientX, currentTarget: e.currentTarget });
                }}
                onTouchEnd={() => {
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                    setIsDragging(false);
                }}
            >
                {Array.from({ length: 90 }, (_, i) => (
                    <div key={i} className={styles.lineHitArea}>
                        <motion.div 
                            className={styles.line} 
                            onClick={() => handleClick(i)}
                            animate={{ height: `${height(i)}px` }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        />
                    </div>
                ))}
                
                {/* Labels positioned at 0, 45, and 90 minutes */}
                <span className={styles.label} style={{ left: '0%', transform: 'translateX(0)' }}>0</span>
                <span className={styles.label} style={{ left: '50%', transform: 'translateX(-50%)' }}>45</span>
                <span className={styles.label} style={{ left: '100%', transform: 'translateX(-100%)' }}>90</span>
                
                {/* Selected minute label - positioned under the selection */}
                <span 
                    className={styles.selectedLabel} 
                    style={{ 
                        left: `${(minute / 90) * 100}%`, 
                        transform: 'translateX(-50%)' 
                    }}
                >
                    {minute}'
                </span>
            </div>
        </div>
    );
}