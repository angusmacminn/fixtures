import styles from "@/styles/HeatMapControls.module.scss";
import { motion } from "motion/react";

export default function HeatMapControls({ 
    selectedEventType,
    onEventTypeChange,
    threeDeeView,   
    onThreeDeeViewChange

}) {
    const eventTypes = [
        { value: "Pass", label: "Passes" },
        { value: "Carry", label: "Carries" },
        { value: "Pressure", label: "Pressure" },
        { value: "Duel", label: "Duels" }
    ];

    
    return (
        <div className={styles.controls}>
            <div className={styles.eventTabs}>
                {eventTypes.map((event) => (
                    <button 
                        key={event.value}
                        onClick={() => onEventTypeChange(event.value)}
                        className={`${styles.eventTab} ${selectedEventType === event.value ? styles.active : ""}`}
                    >
                        {selectedEventType === event.value && (
                            <motion.span 
                                layoutId="eventPill"
                                className={styles.pill}
                                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            />
                        )}
                        <span className={styles.label}>{event.label}</span>
                    </button>
                ))}
            </div>

            <div className={styles.ThreeDeeSelector}>
                <button
                    className={`${styles.viewTab} ${!threeDeeView ? styles.active : ""}`}
                    onClick={() => onThreeDeeViewChange(false)}
                >
                    {!threeDeeView && (
                        <motion.span 
                            layoutId="viewPill"
                            className={styles.viewPill}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                    )}
                    <span className={styles.label}>2D</span>
                </button>
                <button
                    className={`${styles.viewTab} ${threeDeeView ? styles.active : ""}`}
                    onClick={() => onThreeDeeViewChange(true)}
                >
                    {threeDeeView && (
                        <motion.span 
                            layoutId="viewPill"
                            className={styles.viewPill}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                    )}
                    <span className={styles.label}>3D</span>
                </button>
            </div>
        </div>
    );
}