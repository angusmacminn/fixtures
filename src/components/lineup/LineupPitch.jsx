import { useId } from "react";
import useLineupData from "@/utils/useLineupData";
import { getMatchColors } from "@/data/teamColours";
import styles from "@/styles/LineupPitch.module.scss";

// Vertical pitch: width 80, height 120 (top half 0–60, bottom half 60–120)
const PITCH_W = 80;
const PITCH_H = 120;
const HALF = 60;
const MARGIN_X = 10;
const BAND_W = PITCH_W - 2 * MARGIN_X; // 60

// Home (top half): goal at y=0. Player y 0..1 -> pitch 4..56
// Away (bottom half): goal at y=120. Player y 0..1 -> pitch 64..116
function homePitchY(normY) {
    return 4 + normY * 52;
}
function awayPitchY(normY) {
    return 116 - normY * 52;
}
function pitchX(normX) {
    return MARGIN_X + normX * BAND_W;
}

export default function LineupPitch({ gameData, homeTeamName, awayTeamName }) {
    const uid = useId();
    const { home, away } = useLineupData(gameData, homeTeamName, awayTeamName);
    const colors = getMatchColors(homeTeamName, awayTeamName);

    const patternId = `lineupGrid-${uid}`;
    const gridSize = 4;

    return (
        <div className={styles.container}>
            <svg
                viewBox={`0 0 ${PITCH_W} ${PITCH_H}`}
                className={styles.pitchSvg}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <pattern
                        id={patternId}
                        width={gridSize}
                        height={gridSize}
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            width={gridSize + 0.5}
                            height={gridSize + 0.5}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="0.2"
                        />
                    </pattern>
                </defs>

                {/* Pitch base */}
                <rect
                    width={PITCH_W}
                    height={PITCH_H}
                    fill={`url(#${patternId})`}
                />

                {/* Half-way line */}
                <line
                    x1={0}
                    y1={HALF}
                    x2={PITCH_W}
                    y2={HALF}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                />

                {/* Center circle */}
                <circle
                    cx={PITCH_W / 2}
                    cy={HALF}
                    r={9}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.4"
                />

                {/* Top penalty area (home goal) */}
                <rect
                    x={15}
                    y={0}
                    width={50}
                    height={18}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.4"
                />
                {/* Bottom penalty area (away goal) */}
                <rect
                    x={15}
                    y={PITCH_H - 18}
                    width={50}
                    height={18}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.4"
                />

                {/* Home team (top half) */}
                <g aria-label={`${homeTeamName} lineup`}>
                    {home.players.map((player, i) => (
                        <g
                            key={`home-${i}-${player.jerseyNumber}`}
                            transform={`translate(${pitchX(player.x)}, ${homePitchY(player.y)})`}
                            className={styles.playerGroup}
                        >
                            <circle
                                r={4.2}
                                fill={colors?.home ?? "#333"}
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="0.35"
                            />
                            <text
                                textAnchor="middle"
                                dy="0.35em"
                                className={styles.jerseyNumber}
                                fill="#fff"
                            >
                                {player.jerseyNumber}
                            </text>
                            <text
                                textAnchor="middle"
                                dy="6.8"
                                className={styles.lastName}
                            >
                                {player.lastName || "—"}
                            </text>
                        </g>
                    ))}
                </g>

                {/* Away team (bottom half) */}
                <g aria-label={`${awayTeamName} lineup`}>
                    {away.players.map((player, i) => (
                        <g
                            key={`away-${i}-${player.jerseyNumber}`}
                            transform={`translate(${pitchX(player.x)}, ${awayPitchY(player.y)})`}
                            className={styles.playerGroup}
                        >
                            <circle
                                r={4.2}
                                fill={colors?.away ?? "#555"}
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="0.35"
                            />
                            <text
                                textAnchor="middle"
                                dy="0.35em"
                                className={styles.jerseyNumber}
                                fill="#fff"
                            >
                                {player.jerseyNumber}
                            </text>
                            <text
                                textAnchor="middle"
                                dy="6.8"
                                className={styles.lastName}
                            >
                                {player.lastName || "—"}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>

            {home.players.length === 0 && away.players.length === 0 && (
                <p className={styles.emptyMessage}>No lineup data for this match.</p>
            )}
        </div>
    );
}
