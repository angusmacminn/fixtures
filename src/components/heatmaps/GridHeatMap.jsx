import styles from "@/styles/ShotMap.module.scss";
import { motion } from "motion/react";
import { hexToRgb } from '@/data/teamColours';
import useGridHeatmapData from '@/utils/useGridHeatMapData';

export default function GridHeatMap({ gameData, team, color, eventType, minute = 90, flipX = false }){
    const { gridCounts, gridSize, maxCount } = useGridHeatmapData(gameData, {
        team,
        eventType,
        minute,
        flipX
    });
    
    return (

        <div className={styles.shotMapContainer}>
            <svg 
                viewBox="0 0 120 80"
                className={styles.pitchSvg}
                preserveAspectRatio="xMidYMid meet"
            >   
                {/* Animated larger grid overlay */}
                {gridCounts.map((row, rowIndex) => (
                    row.map((count, colIndex) => (
                        <motion.rect
                            key={`${rowIndex}-${colIndex}`}
                            x={colIndex * gridSize}
                            y={rowIndex * gridSize}
                            width={gridSize}
                            height={gridSize}

                            initial={false}
                            animate={{ 
                                opacity: 1,
                                fill: count > 0
  ? `rgba(${hexToRgb(color)}, ${count / maxCount})`
  : "transparent"
                            }}
                            whileHover={{ fill: "#d1ff92" }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                    ))
                ))}
                
                {/* Half-way line */}
                <rect x="60" y="0" width="0.5" height="80" fill="white" />
                
                {/* Left penalty box */}
                <rect x="0" y="20" width="20" height="40" fill="none" stroke="white" strokeWidth="0.5" />
                
                {/* Right penalty box */}
                <rect x="100" y="20" width="20" height="40" fill="none" stroke="white" strokeWidth="0.5" />
            </svg>
        </div>
    )
}