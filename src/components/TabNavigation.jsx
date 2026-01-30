import styles from "@/styles/TabNavigation.module.scss";


export default function TabNavigation( {activeTab, onTabChange}) {

    const tabs = [{ id: 'match', label: 'Match' }, 
                  { id: 'heatmaps', label: 'Heatmaps' }, 
                  { id: 'lineup', label: 'Lineup' }];
        
    return (
        <div className={styles.tabNavigation}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={activeTab === tab.id ? styles.active : ""}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}