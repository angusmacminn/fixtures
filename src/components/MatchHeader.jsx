import styles from "@/styles/MatchHeader.module.scss";
import { motion } from "motion/react";
import { getTeamAcronym } from "@/data/teamAcronyms";
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

function getLastName(fullName) {
    if (!fullName) return "";
    const parts = String(fullName).trim().split(/\s+/);
    return parts[parts.length - 1] ?? "";
}

export default function MatchHeader({ matchData, gameData = [] }) {
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
        const goalShots = (gameData || []).filter(
            (e) => e.type?.name === "Shot" && e.shot?.outcome?.name === "Goal"
        );

        const mapped = goalShots
            .map((e) => ({
                key: e.id ?? `${e.team?.name ?? "team"}-${e.minute ?? 0}-${e.second ?? 0}`,
                team: e.team?.name,
                minute: e.minute ?? 0,
                second: e.second ?? 0,
                lastName: getLastName(e.player?.name),
            }))
            .sort((a, b) => (a.minute - b.minute) || (a.second - b.second));

        return {
            homeScorers: mapped.filter((g) => g.team === homeTeamName),
            awayScorers: mapped.filter((g) => g.team === awayTeamName),
        };
    }, [gameData, homeTeamName, awayTeamName]);

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
                    <div className={styles.teamAbbrWrapLeft}>
                        <span className={styles.teamAbbr}>{homeAcronym}</span>
                    </div>
                    <div className={styles.scoreBox}>
                        <span className={styles.score}>
                            {homeTeamScore} : {awayTeamScore}
                        </span>
                    </div>
                    <div className={styles.teamAbbrWrapRight}>
                        <span className={styles.teamAbbr}>{awayAcronym}</span>
                    </div>

                    {homeScorers.length > 0 && (
                        <div className={styles.scorersLeft}>
                            {homeScorers.map((s) => (
                                <div key={s.key} className={styles.scorerRow}>
                                    <span className={styles.scorerDot} />
                                    <span className={styles.scorerName}>{s.lastName}</span>
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
                                    <span className={styles.scorerName}>{s.lastName}</span>
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
