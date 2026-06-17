import { motion } from "motion/react";
import { useState, useRef, useId, useCallback } from "react";
import styles from "@/styles/TimeSlider.module.scss";

const MIN_MINUTE = 0;
const REGULATION_MAX = 90;

function clampMinute(value, maxMinute) {
    return Math.max(MIN_MINUTE, Math.min(maxMinute, value));
}

function minuteFromClientX(clientX, rect, maxMinute) {
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(percent * maxMinute);
}

export default function TimeSlider({ minute, onChange, maxMinute = REGULATION_MAX, variant = "" }) {
    const [isDragging, setIsDragging] = useState(false);
    const labelId = useId();

    const trackRef = useRef(null);
    const rafRef = useRef(null);
    const latestClientXRef = useRef(0);

    const scheduleMinuteUpdate = useCallback((clientX) => {
        latestClientXRef.current = clientX;

        if (rafRef.current) return;

        rafRef.current = requestAnimationFrame(() => {
            const track = trackRef.current;
            if (!track) {
                rafRef.current = null;
                return;
            }
            const rect = track.getBoundingClientRect();
            onChange(minuteFromClientX(latestClientXRef.current, rect, maxMinute));
            rafRef.current = null;
        });
    }, [onChange, maxMinute]);

    const endDrag = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setIsDragging(false);
    }, []);

    const handlePointerDown = (e) => {
        if (e.button !== 0) return;

        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
        scheduleMinuteUpdate(e.clientX);
    };

    const handlePointerMove = (e) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
        scheduleMinuteUpdate(e.clientX);
    };

    const handlePointerUp = (e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        endDrag();
    };

    const handlePointerCancel = (e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        endDrag();
    };

    const handleKeyDown = (e) => {
        let delta = 0;

        switch (e.key) {
            case "ArrowLeft":
            case "ArrowDown":
                delta = e.shiftKey ? -5 : -1;
                break;
            case "ArrowRight":
            case "ArrowUp":
                delta = e.shiftKey ? 5 : 1;
                break;
            case "Home":
                onChange(MIN_MINUTE);
                e.preventDefault();
                return;
            case "End":
                onChange(maxMinute);
                e.preventDefault();
                return;
            default:
                return;
        }

        e.preventDefault();
        onChange(clampMinute(minute + delta, maxMinute));
    };

    const height = (lineMinute) => {
        const distance = Math.abs(lineMinute - minute);
        if (distance === 0) return 28;
        if (distance === 1) return 16;
        if (distance === 2) return 12;
        if (distance === 3) return 8;
        if (distance === 4) return 4;
        if (distance >= 5) return 1;
        return 8;
    };

    return (
        <div className={`${styles.sliderWrapper} ${styles[variant]}`}>
            <div className={styles.timeSliderLabel} id={labelId}>
                <p>Drag or use arrow keys to adjust minute</p>
            </div>
            <div
                ref={trackRef}
                role="slider"
                tabIndex={0}
                className={styles.timeSlider}
                aria-label="Match minute"
                aria-describedby={labelId}
                aria-valuemin={MIN_MINUTE}
                aria-valuemax={maxMinute}
                aria-valuenow={minute}
                aria-valuetext={`${minute} minutes`}
                data-dragging={isDragging || undefined}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onKeyDown={handleKeyDown}
            >
                {Array.from({ length: maxMinute + 1 }, (_, i) => (
                    <div key={i} className={styles.lineHitArea} aria-hidden="true">
                        <motion.div
                            className={styles.line}
                            animate={{ height: `${height(i)}px` }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        />
                    </div>
                ))}

                <span className={styles.label} style={{ left: "0%", transform: "translateX(0)" }} aria-hidden="true">0</span>
                <span
                    className={styles.label}
                    style={{ left: `${(45 / maxMinute) * 100}%`, transform: "translateX(-50%)" }}
                    aria-hidden="true"
                >
                    45
                </span>
                <span
                    className={styles.label}
                    style={{
                        left: `${(Math.min(REGULATION_MAX, maxMinute) / maxMinute) * 100}%`,
                        transform: "translateX(-50%)",
                    }}
                    aria-hidden="true"
                >
                    90
                </span>
                {/* {maxMinute > REGULATION_MAX && (
                    <span
                        className={styles.label}
                        style={{ left: "100%", transform: "translateX(-100%)" }}
                        aria-hidden="true"
                    >
                        {maxMinute}
                    </span>
                )} */}

                <span
                    className={styles.selectedLabel}
                    aria-hidden="true"
                    style={{
                        left: `${(minute / maxMinute) * 100}%`,
                        transform: "translateX(-50%)",
                    }}
                >
                    {minute}&apos;
                </span>
            </div>
        </div>
    );
}
