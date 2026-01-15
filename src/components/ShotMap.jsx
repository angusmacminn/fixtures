import { useState, useEffect } from "react"
// import styles from "@/styles/Home.module.scss";
import { motion, AnimatePresence } from "motion/react";
import styles from "@/styles/ShotMap.module.scss";
import { teamColors, getTeamColor, getTeamColorWithOpacity } from "@/data/teamColours";


export default function ShotMap({gameData}){

    // state to control the player modal
    const [hoveredShot, setHoveredShot] = useState(null)

    // filter the data to only include shots
    const shots = gameData.filter(event => event.type.name === "Shot")
    .map(shot => ({
        id: shot.id,
        player: shot.player?.name,
        team: shot.team?.name,
        location: shot.location,
        outcome: shot.shot?.outcome?.name,
        xg: shot.shot.statsbomb_xg || 0,
        minute: shot.minute,
    }))    

    const getShotColor = (shot) => {
        const isHome = shot.team === homeTeam;
        
        if (shot.outcome === "Goal") {
            return isHome ? "#10b981" : "#059669"; // Light/dark green
        }
        
        return isHome ? "#3b82f6" : "#ef4444"; // Blue/red
    };
    // get the two teams
    const teams = [...new Set(shots.map(shot => shot.team))]
    const homeTeam = teams[0] 
    const awayTeam = teams[1]
    
    // normalize function for shot position
    const normalizePosition = (shot) => {
        const [x, y] = shot.location

        // if away team, flip horizontally
        if(shot.team === awayTeam){
            return{
                x: 120 - x, //flip x-coordinate
                y: y // keep y the same
            }
        }
        return { x, y};
    }

    // create a grid pattern for pitch overlay / animation
    const gridSpacing = 5; // Fewer, larger cells
    const gridCells = [];
    
    for (let y = 0; y < 80; y += gridSpacing) {
        for (let x = 0; x < 120; x += gridSpacing) {
            gridCells.push({ x, y });
        }
    }

    return(
    
        <div className={styles.shotMapContainer}>
            <svg 
            viewBox="0 0 120 80" // match the actual pitch dimensions
            className={styles.pitchSvg}
            preserveAspectRatio="xMidYMid meet"
            >   
                
                {/* Animated larger grid overlay */}
                {gridCells.map((cell, i) => (
                    <motion.rect
                        key={i}
                        x={cell.x}
                        y={cell.y}
                        width={gridSpacing }
                        height={gridSpacing}
                        fill="#55B500" //cell fill
                        stroke="#418902" //cell border
                        strokeWidth="0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1.0 }}
                        whileHover={{ fill: "#d1ff92", }} //cell hover fill
                        transition={{ type: "easeInOut", stiffness: 300 }}
                    />
                ))}
                
                {/* Half-way line */}
                <rect x="60" y="0" width="0.5" height="80" fill="white" />
                
                {/* Left penalty box */}
                <rect x="0" y="20" width="20" height="40" fill="none" stroke="white" strokeWidth="0.5" />
                
                {/* Right penalty box */}
                <rect x="100" y="20" width="20" height="40" fill="none" stroke="white" strokeWidth="0.5" />

                {/* Map all shots */}
                {shots.map(shot => {
                    const pos = normalizePosition(shot);
                    const isHovered = hoveredShot?.id === shot.id;
                    const isGoal = shot.outcome === "Goal";
                    const isHome = shot.team === homeTeam;
                    const size = (2.2 + shot.xg * 5.5) * 2;

                    return (
                        <motion.rect
                            
                            x={pos.x - size / 2}
                            y={pos.y - size / 2}
                            width={size}
                            height={size}
                            fill={isGoal ? "#fbbf24" : getTeamColorWithOpacity(shot.team, 0.85)}
                            stroke={isGoal ? (isHome ? "#3b82f6" : "#ef4444") : "#000000"}
                            opacity={isHovered ? 1 : 0.85}
                            
                            strokeWidth={isHovered ? 0.3 : 0.0}
                            whileHover={{ scale: 1.3 }}
                            onMouseEnter={() => setHoveredShot(shot)}
                            onMouseLeave={() => setHoveredShot(null)}
                            style={{ cursor: 'pointer' }}
                        />
                    );
                })}
            </svg>

            {/* Tootip */}
            <AnimatePresence>
                {hoveredShot && (
                    <motion.div
                        className={styles.tooltip}
                        initial={{ opacity: 0, y: -10}}
                        animate={{ opacity: 1, y: 0}}
                        exit={{ opacity: 0, y: -10}}
                        transition={{ duration: 0.2}}
                    >
                        <h4>{hoveredShot.player}</h4>
                        <p className={styles.team}>{hoveredShot.team}</p>
                        <div className={styles.tooltipStats}>
                            <span>xG: <strong>{hoveredShot.xg.toFixed(2)}</strong></span>
                            <span>Min: <strong>{hoveredShot.minute}'</strong></span>
                        </div>
                        <p className={styles.outcome}>{hoveredShot.outcome}</p>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}