import styles from "@/styles/HeatMapControls.module.scss";
import { getTeamColor } from "@/data/teamColours";

export default function HeatMapControls({ 
    teams, 
    selectedTeam, 
    onTeamChange,
    selectedEventType,
    onEventTypeChange 
}) {
    const eventTypes = [
        { value: "Pass", label: "Passes" },
        { value: "Carry", label: "Carries" },
        { value: "Pressure", label: "Pressure" },
        { value: "Duel", label: "Duels" }
    ];
    
    return (
        <div className={styles.controls}>
            <div className={styles.teamSelector}>
                {teams.map((team) => (
                    <button 
                        key={team}
                        onClick={() => onTeamChange(team)}
                        className={selectedTeam === team ? styles.active : ""}
                        
                    >
                        {team}
                    </button>
                ))}
            </div>
            
            <div className={styles.eventTabs}>
                {eventTypes.map((event) => (
                    <button 
                        key={event.value}
                        onClick={() => onEventTypeChange(event.value)}
                        className={selectedEventType === event.value ? styles.active : ""}
                    >
                        {event.label}
                    </button>
                ))}
            </div>
        </div>
    );
}