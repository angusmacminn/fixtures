import { motion } from "motion/react";
import { useState } from "react";
import styles from "@/styles/TimeSlider.module.scss";

export default function TimeSlider({ minute, onChange }) {
    const [isDragging, setIsDragging] = useState(false);
    
    const handleClick = (clickedMinute) => {
        if (isDragging) return;
        onChange(clickedMinute);
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging && e.buttons !== 1) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const clickedMinute = Math.round(percent * 90);
        onChange(clickedMinute);
    };

    // For each line, calculate if it should be tall/medium/short
    const height = (lineMinute) => {
        const distance = Math.abs(lineMinute - minute);
        if (distance === 0) return 24; // Selected
        if (distance === 1) return 16; // Adjacent
        return 8; // Default
    };

    console.log(minute)
    
    return (
        <div className={styles.sliderWrapper}>
            <div 
                className={styles.timeSlider}
                onMouseDown={(e) => {
                    setIsDragging(true);
                    handleMouseMove(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
            >
                {Array.from({ length: 90 }, (_, i) => (
                    <motion.div 
                        className={styles.line} 
                        key={i}
                        onClick={() => handleClick(i)}
                        animate={{ height: `${height(i)}px` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                ))}
                
                {/* Labels positioned at 0, 45, and 90 minutes */}
                <span className={styles.label} style={{ left: '0%', transform: 'translateX(0)' }}>0</span>
                <span className={styles.label} style={{ left: '50%', transform: 'translateX(-50%)' }}>45</span>
                <span className={styles.label} style={{ left: '100%', transform: 'translateX(-100%)' }}>90</span>
            </div>
        </div>
    );
}