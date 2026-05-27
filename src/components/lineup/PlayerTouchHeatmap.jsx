import { useId } from "react";
import usePlayerTouchLocations from "@/utils/usePlayerTouchLocations";
import styles from "@/styles/PlayerStatsModal.module.scss";

const GRID_SIZE = 4;

const HEAT_SCALE = [
    { stop: 0.0, h: 265, s: 75, l: 8 },
    { stop: 0.25, h: 285, s: 70, l: 25 },
    { stop: 0.50, h: 330, s: 75, l: 38 },
    { stop: 0.75, h: 25, s: 90, l: 55 },
    { stop: 1.0, h: 50, s: 95, l: 75 },
];

function lerpHue(h1, h2, t) {
    let diff = h2 - h1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return ((h1 + diff * t) % 360 + 360) % 360;
}

function interpolateColor(scale, t) {
    const clamped = Math.max(0, Math.min(1, t));
    for (let i = 0; i < scale.length - 1; i += 1) {
        const a = scale[i];
        const b = scale[i + 1];
        if (clamped >= a.stop && clamped <= b.stop) {
            const localT = (clamped - a.stop) / (b.stop - a.stop);
            const h = lerpHue(a.h, b.h, localT);
            const s = a.s + (b.s - a.s) * localT;
            const l = a.l + (b.l - a.l) * localT;
            return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
        }
    }
    const last = scale[scale.length - 1];
    return `hsl(${last.h}, ${last.s}%, ${last.l}%)`;
}

export default function PlayerTouchHeatmap({ gameData, playerName, flipX = false }) {
    const uid = useId();
    const eventLocations = usePlayerTouchLocations(gameData, playerName, flipX);

    const patternId = `touchGrid-${uid}`;
    const rows = Math.ceil(80 / GRID_SIZE);
    const cols = Math.ceil(120 / GRID_SIZE);
    const gridCounts = Array.from({ length: rows }, () => Array(cols).fill(0));

    eventLocations.forEach((loc) => {
        const col = Math.floor(loc.x / GRID_SIZE);
        const row = Math.floor(loc.y / GRID_SIZE);
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            gridCounts[row][col] += 1;
        }
    });

    let maxCount = 0;
    gridCounts.forEach((row) => {
        row.forEach((count) => {
            if (count > maxCount) maxCount = count;
        });
    });

    if (eventLocations.length === 0) {
        return (
            <div className={styles.touchHeatmapWrap}>
                <p className={styles.touchHeatmapEmpty}>No touch location data</p>
            </div>
        );
    }

    return (
        <div className={styles.touchHeatmapWrap}>
            <span className={styles.touchHeatmapLabel}>Touch heatmap</span>
            <svg
                viewBox="0 0 120 80"
                className={styles.touchHeatmapSvg}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
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
                            strokeWidth="0.15"
                        />
                    </pattern>
                </defs>
                <rect width="120" height="80" fill={`url(#${patternId})`} />
                <g>
                    {gridCounts.map((row, rowIndex) =>
                        row.map((count, colIndex) => {
                            const normalized = maxCount > 0 ? count / maxCount : 0;
                            const intensity = Math.pow(normalized, 0.6);
                            const cx = (colIndex + 0.5) * GRID_SIZE;
                            const cy = (rowIndex + 0.5) * GRID_SIZE;
                            const r = count > 0 ? (intensity * (GRID_SIZE + 5)) / 2 : 0;

                            if (r <= 0) return null;

                            return (
                                <circle
                                    key={`${rowIndex}-${colIndex}`}
                                    cx={cx}
                                    cy={cy}
                                    r={r}
                                    fill={interpolateColor(HEAT_SCALE, intensity)}
                                    opacity={0.4 + intensity * 0.7}
                                />
                            );
                        }),
                    )}
                </g>
                <line x1="60" y1="0" x2="60" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
                <rect x="0" y="20" width="20" height="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.35" />
                <rect x="100" y="20" width="20" height="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.35" />
            </svg>
        </div>
    );
}
