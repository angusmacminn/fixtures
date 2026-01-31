import styles from "@/styles/MatchHeader.module.scss";
import { motion } from "motion/react";
import { getTeamAcronym } from "@/data/teamAcronyms";

function formatMatchDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function MatchHeader({ matchData }) {
    const homeTeamName = matchData.home_team.home_team_name;
    const homeTeamScore = matchData.home_score;
    const awayTeamName = matchData.away_team.away_team_name;
    const awayTeamScore = matchData.away_score;
    const stadium = matchData.stadium?.name ?? "";
    const matchWeek = matchData.match_week;
    const matchDate = formatMatchDate(matchData.match_date);

    const homeAcronym = getTeamAcronym(homeTeamName);
    const awayAcronym = getTeamAcronym(awayTeamName);

    return (
        <div className={styles.matchHeader}>
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
                    <span className={styles.teamAbbr}>{homeAcronym}</span>
                    <div className={styles.scoreBox}>
                        <span className={styles.score}>
                            {homeTeamScore} : {awayTeamScore}
                        </span>
                    </div>
                    <span className={styles.teamAbbr}>{awayAcronym}</span>
                </div>
            </motion.div>
        </div>
    );
}
