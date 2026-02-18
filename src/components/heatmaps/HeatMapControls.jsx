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
                        {event.label}
                        {selectedEventType === event.value && (
                            <motion.span 
                                layoutId="eventUnderline"
                                className={styles.underline}
                                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className={styles.ThreeDeeSelector}>
                <button
                    className={`${styles.viewTab} ${!threeDeeView ? styles.active : ""}`}
                    onClick={() => onThreeDeeViewChange(false)}
                >
                    2D
                    {!threeDeeView && (
                        <motion.span 
                            layoutId="viewUnderline"
                            className={styles.viewUnderline}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                    )}
                </button>
                <button
                    className={`${styles.viewTab} ${threeDeeView ? styles.active : ""}`}
                    onClick={() => onThreeDeeViewChange(true)}
                >
                    3D
                    {threeDeeView && (
                        <motion.span 
                            layoutId="viewUnderline"
                            className={styles.viewUnderline}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                    )}
                </button>
                <div className={styles.heatmapLegend}>
                    <span className={styles.legendLabel}>Less</span>
                    <div className={styles.legendBar} />
                    <span className={styles.legendLabel}>More</span>

                </div>
            </div>
        </div>
    );
}