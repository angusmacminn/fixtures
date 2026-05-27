import { useEffect } from "react";
import usePlayerStats from "@/utils/usePlayerStats";
import PlayerTouchHeatmap from "@/components/lineup/PlayerTouchHeatmap";
import styles from "@/styles/PlayerStatsModal.module.scss";

function StatRow({ label, value }) {
    return (
        <div className={styles.statRow}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statValue}>{value}</span>
        </div>
    );
}

export default function PlayerStatsModal({ open, onClose, player, teamName, gameData, awayTeamName }) {
    const stats = usePlayerStats(gameData, player?.playerName);

    useEffect(() => {
        if (!open) return;
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    const passPct = stats.passes > 0
        ? Math.round((stats.passesComplete / stats.passes) * 100)
        : 0;

    return (
        <div
            className={styles.overlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-modal-title"
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <header className={styles.header}>
                    <span className={styles.jersey}>#{player?.jerseyNumber ?? "—"}</span>
                    <h2 id="player-modal-title" className={styles.title}>
                        {player?.playerName ?? player?.lastName ?? "Player"}
                    </h2>
                    <p className={styles.team}>{teamName}</p>
                </header>
                <div className={styles.stats}>
                    <StatRow label="Shots" value={stats.shots} />
                    <StatRow label="Shots on target" value={stats.shotsOnTarget} />
                    <StatRow label="Goals" value={stats.goals} />
                    <StatRow label="xG" value={stats.xg} />
                    <StatRow label="Passes" value={stats.passes} />
                    <StatRow label="Pass completion" value={`${passPct}%`} />
                    <StatRow label="Fouls" value={stats.fouls} />
                </div>
                <PlayerTouchHeatmap
                    gameData={gameData}
                    playerName={player?.playerName}
                    flipX={teamName === awayTeamName}
                />
            </div>
        </div>
    );
}
