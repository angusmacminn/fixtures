import { useMemo } from 'react';

function getLastName(fullName) {
    if (!fullName) return '';
    const parts = String(fullName).trim().split(/\s+/);
    return parts[parts.length - 1] ?? '';
}

/**
 * Position names as in GameData (StatsBomb) -> normalized (y, x).
 * y: 0 = own goal line, 1 = opposition goal. x: 0 = left touchline, 1 = right.
 */
const POSITION_COORDINATES = {
    Goalkeeper: { y: 0.16, x: 0.5 },

    "Right Back": { y: 0.2, x: 1.0 },
    "Right Center Back": { y: 0.2, x: 0.72 },
    "Center Back": { y: 0.2, x: 0.5 },
    "Left Center Back": { y: 0.2, x: 0.28 },
    "Left Back": { y: 0.2, x: 0.00 },

    "Right Defensive Midfield": { y: 0.36, x: 0.75 },
    "Center Defensive Midfield": { y: 0.36, x: 0.5 },
    "Left Defensive Midfield": { y: 0.36, x: 0.25 },
    "Right Center Midfield": { y: 0.36, x: 0.72 },
    "Center Midfield": { y: 0.36, x: 0.5 },
    "Left Center Midfield": { y: 0.36, x: 0.28 },
    "Right Midfield": { y: 0.38, x: 0.88 },
    "Left Midfield": { y: 0.38, x: 0.12 },

    "Right Wing": { y: 0.56, x: 1.0 },
    "Right Attacking Midfield": { y: 0.56, x: 0.72 },
    "Center Attacking Midfield": { y: 0.56, x: 0.5 },
    "Left Attacking Midfield": { y: 0.56, x: 0.28 },
    "Left Wing": { y: 0.56, x: 0.0 },
    "Right Center Forward": { y: 0.58, x: 0.65 },
    "Left Center Forward": { y: 0.58, x: 0.35 },

    Striker: { y: 0.72, x: 0.5 },
    "Center Forward": { y: 0.72, x: 0.5 },
};

/** Spread factor to add spacing between players (1 = no change, >1 = more gap) */
const SPREAD_X = 1;
const SPREAD_Y = 1.5;
const CENTER_Y = 0.35;

/**
 * Place each player using exact position name from GameData.
 * Applies spread so players aren’t too tight; falls back to center if unknown.
 */
function placePlayers(lineup) {
    return lineup.map((entry) => {
        const name = entry.position?.name;
        const coords = name != null && POSITION_COORDINATES[name]
            ? POSITION_COORDINATES[name]
            : { y: 0.5, x: 0.5 };
        let x = 0.5 + (coords.x - 0.5) * SPREAD_X;
        let y = CENTER_Y + (coords.y - CENTER_Y) * SPREAD_Y;
        x = Math.max(0.06, Math.min(0.94, x));
        y = Math.max(0.04, Math.min(0.92, y));
        return {
            ...entry,
            x,
            y,
        };
    });
}

/**
 * Extract starting lineups from gameData (array of events).
 * Expects two "Starting XI" events (one per team) with tactics.lineup.
 * @returns { home: { teamName, formation, players }, away: { ... } }
 */
export default function useLineupData(gameData, homeTeamName, awayTeamName) {
    return useMemo(() => {
        const events = Array.isArray(gameData) ? gameData : [];
        const startingXIs = events.filter((e) => e.type?.name === 'Starting XI');
        const homeEvent = startingXIs.find((e) => e.team?.name === homeTeamName);
        const awayEvent = startingXIs.find((e) => e.team?.name === awayTeamName);

        function buildLineup(event) {
            if (!event?.tactics?.lineup) return { teamName: null, formation: null, players: [] };
            const formation = event.tactics.formation;
            const placed = placePlayers(
                event.tactics.lineup.map((entry) => ({
                    player: entry.player,
                    position: entry.position,
                    jersey_number: entry.jersey_number,
                }))
            );
            const players = placed.map((p) => ({
                playerName: p.player?.name,
                lastName: getLastName(p.player?.name),
                jerseyNumber: String(p.jersey_number ?? ''),
                x: p.x,
                y: p.y,
            }));
            return {
                teamName: event.team?.name,
                formation,
                players,
            };
        }

        return {
            home: homeEvent ? buildLineup(homeEvent) : { teamName: homeTeamName, formation: null, players: [] },
            away: awayEvent ? buildLineup(awayEvent) : { teamName: awayTeamName, formation: null, players: [] },
        };
    }, [gameData, homeTeamName, awayTeamName]);
}

export { placePlayers, POSITION_COORDINATES };
