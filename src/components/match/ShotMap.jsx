import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react";
import styles from "@/styles/ShotMap.module.scss";
import { getTeamColorWithOpacity } from "@/data/teamColours";


export default function ShotMap({gameData, team, minute, homeTeam, awayTeam}){
    
    const [hoveredShot, setHoveredShot] = useState(null)

    // All shots for the selected team, computed once
    const shots = useMemo(() => {
        const rawShots = gameData.filter(event => event.type?.name === "Shot");
        const teamFiltered = !team ? rawShots : rawShots.filter(shot => shot.team?.name === team);
        
        return teamFiltered.map((shot) => ({
            id: shot.id,
            player: shot.player?.name,
            team: shot.team?.name,
            location: shot.location,
            outcome: shot.shot?.outcome?.name,
            xg: shot.shot?.statsbomb_xg || 0,
            minute: shot.minute,
        }));
    }, [gameData, team]);
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


    return(
<>
    
            <div className={styles.shotMapHeader}>
                <h2>
                    Attempts
                </h2>
            </div>
    
    
            <div className={styles.shotMapContainer}>
                <svg 
                viewBox="0 0 120 80" // match the actual pitch dimensions
                className={styles.pitchSvg}
                preserveAspectRatio="xMidYMid meet"
                >   
                    
                    {/* Subtle grid pattern */}
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <rect width="10" height="10" fill="transparent" />
                            <path
                                d="M 10 0 L 0 0 0 10"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="1.0"
                            />
                        </pattern>
                    </defs>
                    <rect width="120" height="80" fill="url(#grid)" />
                    
                    {/* Half-way line */}
                    <rect x="60" y="0" width="0.5" height="80" fill="rgba(255,255,255,0.15)" />
                    
                    {/* Left penalty box */}
                    <rect x="0" y="20" width="20" height="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    
                    {/* Right penalty box */}
                    <rect x="100" y="20" width="20" height="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    
                    {/* Map all shots — opacity driven by minute */}
                    {shots.map(shot => {
                        const pos = normalizePosition(shot);
                        const isHovered = hoveredShot?.id === shot.id;
                        const isGoal = shot.outcome === "Goal";
                        const visible = shot.minute <= minute;
                        const size = 4 + shot.xg * 8;

                        return (
                            <motion.circle
                                key={shot.id}
                                cx={pos.x}
                                cy={pos.y}
                                r={size / 2}
                                fill={isGoal ? "#70E000" : getTeamColorWithOpacity(shot.team, 0.85)}
                                stroke="#2A2E36"
                                strokeWidth={isHovered ? 0.5 : 0}
                                animate={{
                                    opacity: visible ? (isHovered ? 1 : 0.85) : 0,
                                    scale: visible ? 1 : 0.5,
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                whileHover={visible ? { scale: 1.3 } : undefined}
                                onMouseEnter={() => visible && setHoveredShot(shot)}
                                onMouseLeave={() => setHoveredShot(null)}
                                style={{
                                    cursor: visible ? 'pointer' : 'default',
                                    pointerEvents: visible ? 'auto' : 'none',
                                    transformOrigin: 'center',
                                }}
                            />
                        );
                    })}
                </svg>
    
                {/* Tootip */}
                <AnimatePresence>
                    {hoveredShot && (
                        <motion.div
                            className={styles.tooltip}
                            initial={{ opacity: 0, y: -10, scale: 0.97}}
                            animate={{ opacity: 1, y: 0, scale: 1}}
                            exit={{ opacity: 0, y: -10, scale: 0.9}}
                            transition={{ duration: 0.2, ease: "easeOut"}}
                            
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
</>
    )
}