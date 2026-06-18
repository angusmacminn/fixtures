import styles from "@/styles/MatchHeader.module.scss";
import { motion } from "motion/react";
import { getTeamAcronym } from "@/data/teamAcronyms";
import { getGoalsFromEvents } from "@/utils/getGoalEvents";
import { useMemo } from "react";

function formatMatchDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}


export default function MatchHeader({ matchData, gameData = [], isDesktop }) {
    const homeTeamName = matchData.home_team.home_team_name;
    const homeTeamScore = matchData.home_score;
    const awayTeamName = matchData.away_team.away_team_name;
    const awayTeamScore = matchData.away_score;
    const stadium = matchData.stadium?.name ?? "";
    const matchWeek = matchData.match_week;
    const matchDate = formatMatchDate(matchData.match_date);

    const homeAcronym = getTeamAcronym(homeTeamName);
    const awayAcronym = getTeamAcronym(awayTeamName);

    const { homeScorers, awayScorers } = useMemo(() => {
        const goals = getGoalsFromEvents(gameData);

        return {
            homeScorers: goals.filter((g) => g.team === homeTeamName),
            awayScorers: goals.filter((g) => g.team === awayTeamName),
        };
    }, [gameData, homeTeamName, awayTeamName]);

    return (
        <div className={`${styles.matchHeader} ${isDesktop ? styles.desktop : ""}`}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className={styles.metaRow}>
                    <span className={styles.metaLeft}>
                        {stadium}
                        {matchWeek != null && ` • GW ${matchWeek}`}
                    </span>
                    <span className={styles.metaRight}>{matchDate}</span>
                </div>
                <div className={styles.separator} />
                <div className={styles.scoreRow}>
                    <div className={styles.teamAbbrWrapLeft}>
                        <span className={styles.teamAbbr}>{ isDesktop ? homeTeamName : homeAcronym}</span>
                    </div>
                    <div className={styles.scoreBox}>
                        <span className={styles.score}>
                            {homeTeamScore} : {awayTeamScore}
                        </span>
                    </div>
                    <div className={styles.teamAbbrWrapRight}>
                        <span className={styles.teamAbbr}>{ isDesktop ? awayTeamName : awayAcronym}</span>
                    </div>

                    {homeScorers.length > 0 && (
                        <div className={styles.scorersLeft}>
                            {homeScorers.map((s) => (
                                <div key={s.key} className={styles.scorerRow}>
                                    <span className={styles.scorerDot} />
                                    <span className={styles.scorerName}>
                                        {s.lastName}
                                        {s.isOwnGoal ? " (OG)" : ""}
                                    </span>
                                    <span className={styles.scorerMinute}>{s.minute}'</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {awayScorers.length > 0 && (
                        <div className={styles.scorersRight}>
                            {awayScorers.map((s) => (
                                <div key={s.key} className={styles.scorerRow}>
                                    <span className={styles.scorerDot} />
                                    <span className={styles.scorerName}>
                                        {s.lastName}
                                        {s.isOwnGoal ? " (OG)" : ""}
                                    </span>
                                    <span className={styles.scorerMinute}>{s.minute}'</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
