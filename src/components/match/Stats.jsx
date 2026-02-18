import { useMemo } from "react";
import styles from "@/styles/Stats.module.scss";

export default function Stats({ gameData, homeTeam, awayTeam }) {
    const stats = useMemo(() => {
        const shots = { home: 0, away: 0 };
        const shotsOnTarget = { home: 0, away: 0 };
        const xg = { home: 0, away: 0 };
        const goals = { home: 0, away: 0 };
        const possessionEvents = { home: 0, away: 0 };

        const skipTypes = ["Starting XI", "Half Start", "Half End", "Substitution"];
        const inPlayEvents = gameData.filter(
            (e) => !skipTypes.includes(e.type?.name)
        );
        // calculate possession
        inPlayEvents.forEach((event) => {
            const team = event.possession_team?.name;
            if (!team || (team !== homeTeam && team !== awayTeam)) return;

            if (team === homeTeam) possessionEvents.home++;
            else possessionEvents.away++;
        });

        // calculate shots
        const shotEvents = gameData.filter((e) => e.type?.name === "Shot");
        shotEvents.forEach((event) => {
            const team = event.team?.name;
            if (!team || (team !== homeTeam && team !== awayTeam)) return;

            const xgVal = event.shot?.statsbomb_xg ?? 0;
            const outcome = event.shot?.outcome?.name;
            const isGoal = outcome === "Goal";
            const isOnTarget = isGoal || outcome === "Saved";

            if (team === homeTeam) {
                shots.home++;
                xg.home += xgVal;
                if (isGoal) goals.home++;
                if (isOnTarget) shotsOnTarget.home++;
            } else {
                shots.away++;
                xg.away += xgVal;
                if (isGoal) goals.away++;
                if (isOnTarget) shotsOnTarget.away++;
            }
        });

        // calculate possession
        const totalPoss = possessionEvents.home + possessionEvents.away;
        const possession = {
            home: totalPoss > 0 ? Math.round((possessionEvents.home / totalPoss) * 100) : 50,
            away: totalPoss > 0 ? Math.round((possessionEvents.away / totalPoss) * 100) : 50,
        };

        // calculate fouls
        const fouls = { home: 0, away: 0 };
        const foulEvents = gameData.filter((e) => e.type?.name === "Foul Committed");
        foulEvents.forEach((event) => {
            const team = event.team?.name;
            if (!team || (team !== homeTeam && team !== awayTeam)) return;
        
            if (team === homeTeam) fouls.home++;
            else fouls.away++;
        });

        const passes = { home: 0, away: 0 };
        const passesComplete = { home: 0, away: 0 };

        const passEvents = gameData.filter((e) => e.type?.name === "Pass");
        passEvents.forEach((event) => {
        const team = event.team?.name;
        if (!team || (team !== homeTeam && team !== awayTeam)) return;
    
        const isComplete = !event.pass?.outcome; // no outcome = successful pass
    
        if (team === homeTeam) {
            passes.home++;
            if (isComplete) passesComplete.home++;
        } else {
            passes.away++;
            if (isComplete) passesComplete.away++;
        }
        });
        
        const passCompletion = {
            home: passes.home > 0 ? Math.round((passesComplete.home / passes.home) * 100) : 0,
            away: passes.away > 0 ? Math.round((passesComplete.away / passes.away) * 100) : 0,
        };

        return { shots, shotsOnTarget, xg, goals, possession, fouls, passes, passCompletion };
    }, [gameData, homeTeam, awayTeam]);

    const StatRow = ({ home, away, label, format = (v) => v }) => {
        const homeClass = `${styles.value} ${home > away ? styles.winning : ""}`;
        const awayClass = `${styles.value} ${away > home ? styles.winning : ""}`;
    
        return (
            <div className={styles.row}>
                <span className={homeClass}>{format(home)}</span>
                <span className={styles.label}>{label}</span>
                <span className={awayClass}>{format(away)}</span>
            </div>
        );
    };


    const formatXg = (val) => val.toFixed(2);
    return (
        <div className={styles.stats}>
            <div className={styles.statsHeader}>
                <h2>
                    Stats
                </h2>
            </div>
        <StatRow home={stats.shots.home} away={stats.shots.away} label="Shots" />
        <StatRow home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} label="Shots on Target" />
        <StatRow home={stats.xg.home} away={stats.xg.away} label="xG" format={formatXg} />
        <StatRow home={stats.possession.home} away={stats.possession.away} label="Possession" format={(v) => `${v}%`} />
        <StatRow home={stats.passes.home} away={stats.passes.away} label="Passes" />
        <StatRow home={stats.passCompletion.home} away={stats.passCompletion.away} label="Pass Completion" format={(v) => `${v}%`} />
        <StatRow home={stats.fouls.home} away={stats.fouls.away} label="Fouls Committed" />

    </div>
    );
}
