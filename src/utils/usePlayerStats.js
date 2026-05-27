import { useMemo } from 'react';

const SKIP_TYPES = ["Starting XI", "Half Start", "Half End", "Substitution"];

/**
 * Aggregate match stats for a single player from gameData events.
 * @param {Array} gameData - Array of event objects
 * @param {string} playerName - Full player name (e.g. "Mesut Özil")
 * @returns {Object} { shots, shotsOnTarget, goals, passes, passesComplete, fouls, xg }
 */
export default function usePlayerStats(gameData, playerName) {
    return useMemo(() => {
        if (!playerName || !Array.isArray(gameData)) {
            return { shots: 0, shotsOnTarget: 0, goals: 0, passes: 0, passesComplete: 0, fouls: 0, xg: 0 };
        }
        const name = String(playerName).trim();
        let shots = 0, shotsOnTarget = 0, goals = 0, passes = 0, passesComplete = 0, fouls = 0, xg = 0;

        gameData.forEach((event) => {
            if (SKIP_TYPES.includes(event.type?.name)) return;
            const eventPlayer = event.player?.name;
            if (eventPlayer == null || String(eventPlayer).trim() !== name) return;

            switch (event.type?.name) {
                case "Shot":
                    shots++;
                    xg += event.shot?.statsbomb_xg ?? 0;
                    const outcome = event.shot?.outcome?.name;
                    if (outcome === "Goal") goals++;
                    if (outcome === "Goal" || outcome === "Saved") shotsOnTarget++;
                    break;
                case "Pass":
                    passes++;
                    if (!event.pass?.outcome) passesComplete++;
                    break;
                case "Foul Committed":
                    fouls++;
                    break;
                default:
                    break;
            }
        });

        return {
            shots,
            shotsOnTarget,
            goals,
            passes,
            passesComplete,
            fouls,
            xg: Math.round(xg * 100) / 100,
        };
    }, [gameData, playerName]);
}
