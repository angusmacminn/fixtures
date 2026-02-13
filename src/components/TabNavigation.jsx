import styles from "@/styles/TabNavigation.module.scss";
import { motion } from "motion/react";

export default function TabNavigation({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'match', label: 'Match' }, 
        { id: 'heatmaps', label: 'Heatmaps' }, 
        { id: 'lineup', label: 'Lineup' }
    ];
        
    return (
        <div className={styles.tabNavigation}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.span 
                            layoutId="navUnderline"
                            className={styles.underline}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}