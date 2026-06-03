import { useId, useState } from "react";
import useLineupData from "@/utils/useLineupData";
import useMediaQuery from "@/utils/useMediaQuery";
import { getMatchColors } from "@/data/teamColours";
import PlayerStatsModal from "@/components/lineup/PlayerStatsModal";
import styles from "@/styles/LineupPitch.module.scss";

const GRID_SIZE = 4;
const DESKTOP_QUERY = "(min-width: 800px)";

const VERTICAL = {
    orientation: "vertical",
    w: 80,
    h: 120,
    half: 60,
    marginBand: 10,
    get band() {
        return this.w - 2 * this.marginBand;
    },
    mapHome(player) {
        return {
            x: this.marginBand + player.x * this.band,
            y: 4 + player.y * 52,
        };
    },
    mapAway(player) {
        return {
            x: this.marginBand + player.x * this.band,
            y: 116 - player.y * 52,
        };
    },
};

const HORIZONTAL = {
    orientation: "horizontal",
    w: 120,
    h: 80,
    half: 60,
    marginBand: 10,
    get band() {
        return this.h - 2 * this.marginBand;
    },
    mapHome(player) {
        return {
            x: 4 + player.y * 52,
            y: this.marginBand + player.x * this.band,
        };
    },
    mapAway(player) {
        return {
            x: 116 - player.y * 52,
            y: this.marginBand + player.x * this.band,
        };
    },
};

function PitchMarkings({ layout, patternId }) {
    const { w, h, half } = layout;
    const isHorizontal = layout.orientation === "horizontal";

    if (isHorizontal) {
        return (
            <>
                <rect width={w} height={h} fill={`url(#${patternId})`} />
                <line
                    x1={half}
                    y1={0}
                    x2={half}
                    y2={h}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                />
                <circle
                    cx={half}
                    cy={h / 2}
                    r={9}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.4"
                />
                <rect
                    x={0}
                    y={15}
                    width={18}
                    height={50}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.4"
                />
                <rect
                    x={w - 18}
                    y={15}
                    width={18}
                    height={50}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.4"
                />
            </>
        );
    }

    return (
        <>
            <rect width={w} height={h} fill={`url(#${patternId})`} />
            <line
                x1={0}
                y1={half}
                x2={w}
                y2={half}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.5"
            />
            <circle
                cx={w / 2}
                cy={half}
                r={9}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.4"
            />
            <rect
                x={15}
                y={0}
                width={50}
                height={18}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.4"
            />
            <rect
                x={15}
                y={h - 18}
                width={50}
                height={18}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.4"
            />
        </>
    );
}

function PlayerMarkers({
    players,
    teamName,
    side,
    layout,
    fill,
    onPlayerClick,
    playerGroupClass,
    jerseyClass,
    lastNameClass,
}) {
    const map = side === "home" ? layout.mapHome : layout.mapAway;

    return (
        <g aria-label={`${teamName} lineup`}>
            {players.map((player, i) => {
                const { x, y } = map.call(layout, player);
                return (
                    <g
                        key={`${side}-${i}-${player.jerseyNumber}`}
                        transform={`translate(${x}, ${y})`}
                        className={playerGroupClass}
                        onClick={() => onPlayerClick(player, teamName)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                            e.key === "Enter" && onPlayerClick(player, teamName)
                        }
                        aria-label={`${player.playerName || player.lastName}, ${player.jerseyNumber}`}
                    >
                        <circle
                            r={4.2}
                            fill={fill}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="0.35"
                        />
                        <text
                            textAnchor="middle"
                            dy="0.35em"
                            className={jerseyClass}
                            fill="#fff"
                        >
                            {player.jerseyNumber}
                        </text>
                        <text textAnchor="middle" dy="6.8" className={lastNameClass}>
                            {player.lastName || "—"}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

export default function LineupPitch({ gameData, homeTeamName, awayTeamName }) {
    const uid = useId();
    const isDesktop = useMediaQuery(DESKTOP_QUERY);
    const layout = isDesktop ? HORIZONTAL : VERTICAL;
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const { home, away } = useLineupData(gameData, homeTeamName, awayTeamName);
    const colors = getMatchColors(homeTeamName, awayTeamName);

    const patternId = `lineupGrid-${uid}`;

    const handlePlayerClick = (player, teamName) => {
        setSelectedPlayer({ ...player, teamName });
    };

    return (
        <div className={styles.container}>
            <svg
                viewBox={`0 0 ${layout.w} ${layout.h}`}
                className={styles.pitchSvg}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <pattern
                        id={patternId}
                        width={GRID_SIZE}
                        height={GRID_SIZE}
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            width={GRID_SIZE + 0.5}
                            height={GRID_SIZE + 0.5}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="0.2"
                        />
                    </pattern>
                </defs>

                <PitchMarkings layout={layout} patternId={patternId} />

                <PlayerMarkers
                    players={home.players}
                    teamName={homeTeamName}
                    side="home"
                    layout={layout}
                    fill={colors?.home ?? "#333"}
                    onPlayerClick={handlePlayerClick}
                    playerGroupClass={styles.playerGroup}
                    jerseyClass={styles.jerseyNumber}
                    lastNameClass={styles.lastName}
                />

                <PlayerMarkers
                    players={away.players}
                    teamName={awayTeamName}
                    side="away"
                    layout={layout}
                    fill={colors?.away ?? "#555"}
                    onPlayerClick={handlePlayerClick}
                    playerGroupClass={styles.playerGroup}
                    jerseyClass={styles.jerseyNumber}
                    lastNameClass={styles.lastName}
                />
            </svg>

            <PlayerStatsModal
                open={!!selectedPlayer}
                onClose={() => setSelectedPlayer(null)}
                player={selectedPlayer}
                teamName={selectedPlayer?.teamName}
                gameData={gameData}
                awayTeamName={awayTeamName}
            />

            {home.players.length === 0 && away.players.length === 0 && (
                <p className={styles.emptyMessage}>No lineup data for this match.</p>
            )}
        </div>
    );
}
