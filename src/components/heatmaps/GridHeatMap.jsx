import styles from "@/styles/ShotMap.module.scss";
import { useId } from "react";
import { motion } from "motion/react";
import { hexToRgb } from '@/data/teamColours';
import useGridHeatmapData from '@/utils/useGridHeatMapData';

export default function GridHeatMap({ gameData, team, color, eventType, minute = 90, flipX = false }){
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
                            width={gridSize}
                            height={gridSize}
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
                                    x={colIndex * gridSize}
                                    y={rowIndex * gridSize}
                                    width={gridSize}
                                    height={gridSize}
                                    initial={false}
                                    animate={{ 
                                        fill: count > 0
                                            ? `rgba(${hexToRgb(color)}, ${intensity})`
                                            : "transparent"
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