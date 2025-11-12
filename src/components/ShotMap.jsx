import { useState, useEffect } from "react"
// import styles from "@/styles/Home.module.scss";
import { motion, AnimatePresence } from "motion/react";
import styles from "@/styles/ShotMap.module.scss";


export default function ShotMap({gameData}){

    // state to control the player modal
    const [isOpen, setIsOpen] = useState(false);

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

    const firstShot = shots[0]
    const [shotX, shotY] = firstShot?.location || [0,0]

    // create a grid pattern for pitch overlay / animation
    const gridSpacing = 10; // Fewer, larger cells
    const gridCells = [];
    
    for (let y = 0; y < 80; y += gridSpacing) {
        for (let x = 0; x < 120; x += gridSpacing) {
            gridCells.push({ x, y });
        }
    }

    return(
        // <AnimatePresence>
        // <div className={styles.placeholder}>
        //     {!isOpen && (<motion.div 
        //          layoutId="player"
        //          onClick={() => setIsOpen(true)}
        //          className={styles.player}
        //          whileHover={{ scale: 1.1 }}
        //          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        //         />
        //     )}

        //     {isOpen && (
        //         <motion.div
        //           layoutId="player"
        //           onClick={() => setIsOpen(false)}
        //           className={`${styles.player} ${styles.playerExpanded}`}
        //         //   animate={{ scale: 1.5 }}
        //           transition={{ type: "spring", stiffness: 150, damping: 18 }}
        //         >
        //           <motion.h3 layout="position" className={styles.playerName}>
        //             Erling Haaland
        //           </motion.h3>
        //           <motion.p layout="position" className={styles.playerPosition}>
        //             Striker · Manchester City
        //           </motion.p>
        //           <motion.div
        //             className={styles.stats}
        //             initial={{ opacity: 0, y: 10 }}
        //             animate={{ opacity: 1, y: 0 }}
        //             transition={{ delay: 0.2 }}
        //           >
        //             <div>
        //               <p className={styles.stat}>Shots</p>
        //               <p className={styles.statValue}>6</p>
        //             </div>
        //             <div>
        //               <p className={styles.stat}>xG</p>
        //               <p className={styles.statValue}>1.42</p>
        //             </div>
        //           </motion.div>
        //         </motion.div>
        //     )}
        // </div>
        // </AnimatePresence>
        <div className={styles.shotMapContainer}>
            <svg 
            viewBox="0 0 120 80" // match the actual pitch dimensions
            className={styles.pitchSvg}
            preserveAspectRatio="xMidYMid meet"
            >
                
                
                <rect x="0" y="0" width="120" height="80" fill="" stroke="none" />
                
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
                <rect x="0" y="18" width="18" height="44" fill="none" stroke="white" strokeWidth="0.5" />
                
                {/* Right penalty box */}
                <rect x="102" y="18" width="18" height="44" fill="none" stroke="white" strokeWidth="0.5" />

                <circle
                    cx={shotX}
                    cy={shotY}
                    r={2}
                    fill="red"
                    opacity={0.8}
                />
              
            </svg>
        </div>
    )
}