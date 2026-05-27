import { useMemo } from 'react';

const SKIP_TYPES = ["Starting XI", "Half Start", "Half End", "Substitution"];

/**
 * Get all event locations for a player's touches (Pass, Ball Receipt, Carry, Shot, etc.).
 * Optionally flip X so the player's team attacks left-to-right.
 */
export default function usePlayerTouchLocations(gameData, playerName, flipX = false) {
    return useMemo(() => {
        if (!playerName || !Array.isArray(gameData)) return [];
        const name = String(playerName).trim();
        const locations = [];
        gameData.forEach((event) => {
            if (SKIP_TYPES.includes(event.type?.name)) return;
            if (!event.location) return;
            const eventPlayer = event.player?.name;
            if (eventPlayer == null || String(eventPlayer).trim() !== name) return;
            let [x, y] = event.location;
            if (flipX) x = 120 - x;
            locations.push({ x, y });
        });
        return locations;
    }, [gameData, playerName, flipX]);
}
