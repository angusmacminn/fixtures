import { useMemo } from "react";
import styles from "@/styles/Stats.module.scss";

export default function Stats({ gameData, homeTeam, awayTeam }) {
    const stats = useMemo(() => {
        const shots = { home: 0, away: 0 };
        const xg = { home: 0, away: 0 };
        const goals = { home: 0, away: 0 };
        const possessionEvents = { home: 0, away: 0 };

        const skipTypes = ["Starting XI", "Half Start", "Half End", "Substitution"];
        const inPlayEvents = gameData.filter(
            (e) => !skipTypes.includes(e.type?.name)
        );

        inPlayEvents.forEach((event) => {
            const team = event.possession_team?.name;
            if (!team || (team !== homeTeam && team !== awayTeam)) return;

            if (team === homeTeam) possessionEvents.home++;
            else possessionEvents.away++;
        });

        const shotEvents = gameData.filter((e) => e.type?.name === "Shot");
        shotEvents.forEach((event) => {
            const team = event.team?.name;
            if (!team || (team !== homeTeam && team !== awayTeam)) return;

            const xgVal = event.shot?.statsbomb_xg ?? 0;
            const isGoal = event.shot?.outcome?.name === "Goal";

            if (team === homeTeam) {
                shots.home++;
                xg.home += xgVal;
                if (isGoal) goals.home++;
            } else {
                shots.away++;
                xg.away += xgVal;
                if (isGoal) goals.away++;
            }
        });

        const totalPoss = possessionEvents.home + possessionEvents.away;
        const possession = {
            home: totalPoss > 0 ? Math.round((possessionEvents.home / totalPoss) * 100) : 50,
            away: totalPoss > 0 ? Math.round((possessionEvents.away / totalPoss) * 100) : 50,
        };

        return { shots, xg, goals, possession };
    }, [gameData, homeTeam, awayTeam]);

    const formatXg = (val) => val.toFixed(2);

    return (
        <div className={styles.stats}>
            <div className={styles.row}>
                <span className={styles.value}>{stats.shots.home}</span>
                <span className={styles.label}>Shots</span>
                <span className={styles.value}>{stats.shots.away}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.value}>{formatXg(stats.xg.home)}</span>
                <span className={styles.label}>xG</span>
                <span className={styles.value}>{formatXg(stats.xg.away)}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.value}>{stats.goals.home}</span>
                <span className={styles.label}>Goals</span>
                <span className={styles.value}>{stats.goals.away}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.value}>{stats.possession.home}%</span>
                <span className={styles.label}>Possession</span>
                <span className={styles.value}>{stats.possession.away}%</span>
            </div>
        </div>
    );
}
