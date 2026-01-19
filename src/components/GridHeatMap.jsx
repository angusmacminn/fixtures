import styles from "@/styles/ShotMap.module.scss";
import { motion, AnimatePresence } from "motion/react";
import { hexToRgb } from '@/data/teamColours';

export default function GridHeatMap({gameData, team, color, eventType}){
    const gridSize = 5;
    const cols = Math.ceil(120 / gridSize);
    const rows = Math.ceil(80 / gridSize);
    
    const gridCounts = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(0));
    
    // STEP 3: Count events in each cell
    gameData.forEach(event => {
        // Skip if no location data
        if (!event.location) return;
        
        // Skip if wrong team (if team filter is provided)
        if (team && event.team?.name !== team) return;

        // filter by event type if provided
        if(event.type && event.type?.name !== eventType) return;
        
        // Extract coordinates
        const [x, y] = event.location;
        
        // Convert to grid cell indices
        const col = Math.floor(x / gridSize);
        const row = Math.floor(y / gridSize);
        
        // Safety check: ensure we're within grid bounds
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            gridCounts[row][col]++; // Increment counter for this cell
        }
    });

    // After the forEach loop, add:
    const totalEvents = gridCounts.flat().reduce((sum, count) => sum + count, 0);
    const maxCount = Math.max(...gridCounts.flat());
    const activeCells = gridCounts.flat().filter(count => count > 0).length;

    // console.log(`Total events counted: ${totalEvents}`);
    // console.log(`Hottest cell has: ${maxCount} events`);
    // console.log(`Active cells: ${activeCells} / ${cols * rows}`);
    
    console.log('Grid after counting:', gridCounts);

    // create a grid pattern for pitch overlay / animation
    const gridSpacing = 10; // Fewer, larger cells
    const gridCells = [];
    
    for (let y = 0; y < 80; y += gridSpacing) {
        for (let x = 0; x < 120; x += gridSpacing) {
            gridCells.push({ x, y });
        }
    }
    
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
                            stroke="#418902"
                            strokeWidth="0.5"
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: 1.0,
                                fill: count > 0 
                                    ? `rgba(${hexToRgb(color)}, ${maxCount > 0 ? count / maxCount : 0})`
                                    : "#55B500"
                            }}
                            whileHover={{ fill: "#d1ff92" }}
                            transition={{ type: "easeInOut", stiffness: 300 }}
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