import styles from "@/styles/MatchHeader.module.scss";
import {
    motion,
    useMotionValue,
    useTransform,
} from "motion/react";
import { getTeamAcronym } from "@/data/teamAcronyms";
import { useEffect, useMemo } from "react";

const COLLAPSE_SCROLL_PX = 80;

/** Page scroll lives on body (see globals.scss), not window — useScroll() alone stays at 0. */
function getPageScrollTop() {
    return Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop
    );
}

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

    const collapse = useMotionValue(0);

    useEffect(() => {
        const update = () => {
            if (isDesktop) {
                collapse.set(0);
                return;
            }
            const y = getPageScrollTop();
            collapse.set(Math.min(1, Math.max(0, y / COLLAPSE_SCROLL_PX)));
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        document.body.addEventListener("scroll", update, { passive: true });

        return () => {
            window.removeEventListener("scroll", update);
            document.body.removeEventListener("scroll", update);
        };
    }, [isDesktop, collapse]);

    const paddingY = useTransform(collapse, [0, 1], ["24px", "8px"]);
    const metaOpacity = useTransform(collapse, [0, 0.55], [1, 0]);
    const metaMaxHeight = useTransform(collapse, [0, 1], [48, 0]);
    const metaMarginBottom = useTransform(collapse, [0, 1], [12, 0]);
    const separatorOpacity = useTransform(collapse, [0, 0.45], [1, 0]);
    const separatorHeight = useTransform(collapse, [0, 1], [1, 0]);
    const separatorMarginBottom = useTransform(collapse, [0, 1], [16, 0]);
    const scorersOpacity = useTransform(collapse, [0, 0.35], [1, 0]);
    const scorersMaxHeight = useTransform(collapse, [0, 1], [120, 0]);
    const scoreRowGap = useTransform(collapse, [0, 1], ["12px", "0px"]);
    const teamFontSize = useTransform(collapse, [0, 1], ["2.5rem", "1.625rem"]);
    const scoreFontSize = useTransform(collapse, [0, 1], ["2.25rem", "1.5rem"]);
    const scorePaddingY = useTransform(collapse, [0, 1], ["8px", "2px"]);

    const mobileMotion = !isDesktop;

    return (
        <motion.div
            className={`${styles.matchHeader} ${isDesktop ? styles.desktop : ""}`}
            style={mobileMotion ? { paddingTop: paddingY, paddingBottom: paddingY } : undefined}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className={styles.metaRow}
                    style={
                        mobileMotion
                            ? {
                                  opacity: metaOpacity,
                                  maxHeight: metaMaxHeight,
                                  marginBottom: metaMarginBottom,
                                  overflow: "hidden",
                              }
                            : undefined
                    }
                >
                    <span className={styles.metaLeft}>
                        {stadium}
                        {matchWeek != null && ` • GW ${matchWeek}`}
                    </span>
                    <span className={styles.metaRight}>{matchDate}</span>
                </motion.div>
                <motion.div
                    className={styles.separator}
                    style={
                        mobileMotion
                            ? {
                                  opacity: separatorOpacity,
                                  height: separatorHeight,
                                  marginBottom: separatorMarginBottom,
                              }
                            : undefined
                    }
                />
                <motion.div
                    className={styles.scoreRow}
                    style={mobileMotion ? { rowGap: scoreRowGap } : undefined}
                >
                    <div className={styles.teamAbbrWrapLeft}>
                        <motion.span
                            className={styles.teamAbbr}
                            style={mobileMotion ? { fontSize: teamFontSize } : undefined}
                        >
                            {isDesktop ? homeTeamName : homeAcronym}
                        </motion.span>
                    </div>
                    <motion.div
                        className={styles.scoreBox}
                        style={
                            mobileMotion
                                ? { paddingTop: scorePaddingY, paddingBottom: scorePaddingY }
                                : undefined
                        }
                    >
                        <motion.span
                            className={styles.score}
                            style={mobileMotion ? { fontSize: scoreFontSize } : undefined}
                        >
                            {homeTeamScore} : {awayTeamScore}
                        </motion.span>
                    </motion.div>
                    <div className={styles.teamAbbrWrapRight}>
                        <motion.span
                            className={styles.teamAbbr}
                            style={mobileMotion ? { fontSize: teamFontSize } : undefined}
                        >
                            {isDesktop ? awayTeamName : awayAcronym}
                        </motion.span>
                    </div>

                    {homeScorers.length > 0 && (
                        <motion.div
                            className={styles.scorersLeft}
                            style={
                                mobileMotion
                                    ? {
                                          opacity: scorersOpacity,
                                          maxHeight: scorersMaxHeight,
                                          overflow: "hidden",
                                      }
                                    : undefined
                            }
                        >
                            {homeScorers.map((s) => (
                                <div key={s.key} className={styles.scorerRow}>
                                    <span className={styles.scorerDot} />
                                    <span className={styles.scorerName}>{s.lastName}</span>
                                    <span className={styles.scorerMinute}>{s.minute}'</span>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {awayScorers.length > 0 && (
                        <motion.div
                            className={styles.scorersRight}
                            style={
                                mobileMotion
                                    ? {
                                          opacity: scorersOpacity,
                                          maxHeight: scorersMaxHeight,
                                          overflow: "hidden",
                                      }
                                    : undefined
                            }
                        >
                            {awayScorers.map((s) => (
                                <div key={s.key} className={styles.scorerRow}>
                                    <span className={styles.scorerDot} />
                                    <span className={styles.scorerName}>{s.lastName}</span>
                                    <span className={styles.scorerMinute}>{s.minute}'</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
