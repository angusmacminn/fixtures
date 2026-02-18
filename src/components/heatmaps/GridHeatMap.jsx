import styles from "@/styles/ShotMap.module.scss";
import { useId } from "react";
import { motion } from "motion/react";
import useGridHeatmapData from '@/utils/useGridHeatMapData';

const HEAT_SCALE = [
    { stop: 0.0,  h: 260, s: 80, l: 5  },
    { stop: 0.15, h: 275, s: 75, l: 18 },
    { stop: 0.30, h: 300, s: 65, l: 28 },
    { stop: 0.45, h: 330, s: 70, l: 35 },
    { stop: 0.60, h: 10,  s: 80, l: 42 },
    { stop: 0.75, h: 30,  s: 90, l: 52 },
    { stop: 0.90, h: 45,  s: 95, l: 65 },
    { stop: 1.0,  h: 60,  s: 100, l: 85 },
];

function lerpHue(h1, h2, t) {
    let diff = h2 - h1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return ((h1 + diff * t) % 360 + 360) % 360;
}

function interpolateColor(scale, t) {
    const clamped = Math.max(0, Math.min(1, t));
    for (let i = 0; i < scale.length - 1; i++) {
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

export default function GridHeatMap({ gameData, team, eventType, minute = 90, flipX = false }){
    const uid = useId();
    const { gridCounts, gridSize, maxCount } = useGridHeatmapData(gameData, {
        team,
        eventType,
        minute,
        flipX
    });

    const patternId = `pitchGrid-${uid}`;
    const filterId = `heatBlur-${uid}`;
    
    return (
        <div className={styles.shotMapContainer}>
            <svg 
                viewBox="0 0 120 80"
                className={styles.pitchSvg}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <pattern id={patternId} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                        <rect
                            width={gridSize + 1}
                            height={gridSize + 1}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="0.15"
                        />
                    </pattern>
                    <filter id={filterId}>
                        <feGaussianBlur stdDeviation="0.9" />
                    </filter>
                </defs>

                {/* Layer 1: Pitch base */}
                <rect width="120" height="80" fill={`url(#${patternId})`} />

                {/* Layer 2: Heatmap (blurred) */}
                <g filter={`url(#${filterId})`}>
                    {gridCounts.map((row, rowIndex) => (
                        row.map((count, colIndex) => {
                            const normalized = maxCount > 0 ? count / maxCount : 0;
                            const intensity = Math.pow(normalized, 0.6);
                            return (
                                <motion.rect
                                    key={`${rowIndex}-${colIndex}`}
                                    x={colIndex * gridSize - 0.5}
                                    y={rowIndex * gridSize - 0.5}
                                    width={gridSize}
                                    height={gridSize}
                                    initial={false}
                                    animate={{ 
                                            fill: interpolateColor(HEAT_SCALE, intensity),
                                        opacity: count > 0 ? 0.35 + intensity * 0.65 : 0,
                                    }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                />
                            );
                        })
                    ))}
                </g>

                {/* Half-way line */}
            <rect
              x="60"
              y="0"
              width="0.5"
              height="80"
              fill="rgba(255,255,255,0.15)"
            />

            {/* Left penalty box */}
            <rect
              x="0"
              y="20"
              width="20"
              height="40"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
            />

            {/* Right penalty box */}
            <rect
              x="100"
              y="20"
              width="20"
              height="40"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
            />
            </svg>
        </div>
    );
}