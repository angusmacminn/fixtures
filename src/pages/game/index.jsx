"use client";

import MatchHeader from '@/components/MatchHeader';
import matchInfo from '../../data/15-16-PLFixtures.json';
import data from '../../data/GameData.json';
import styles from "@/styles/Home.module.scss";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function Game() {
    // state to control the player modal
    const [isOpen, setIsOpen] = useState(false);

    // filter match and team data to send to header
    const headerData = matchInfo.find(event => event.match_id === 3754171)
    console.log('MatchInfo:', headerData) 

    // filter the data to only include shots
    const shots = data.filter(event => event.type.name === "Shot")
    .map(shot => ({
        id: shot.id,
        player: shot.player?.name,
        team: shot.team?.name,
        location: shot.location,
        outcome: shot.shot?.outcome?.name,
        xg: shot.shot.statsbomb_xg || 0,
        minute: shot.minute,
    }))
    
    // console.log('Shots with xG:', shots)
    
    return (
        <section className={styles.main}>

            <MatchHeader matchData={headerData}/>

            

            <AnimatePresence>
            <div className={styles.placeholder}>
                {!isOpen && (<motion.div 
                     layoutId="player"
                     onClick={() => setIsOpen(true)}
                     className={styles.player}
                     whileHover={{ scale: 1.1 }}
                     transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    />
                )}

                {isOpen && (
                    <motion.div
                      layoutId="player"
                      onClick={() => setIsOpen(false)}
                      className={`${styles.player} ${styles.playerExpanded}`}
                    //   animate={{ scale: 1.5 }}
                      transition={{ type: "spring", stiffness: 150, damping: 18 }}
                    >
                      <motion.h3 layout="position" className={styles.playerName}>
                        Erling Haaland
                      </motion.h3>
                      <motion.p layout="position" className={styles.playerPosition}>
                        Striker · Manchester City
                      </motion.p>
                      <motion.div
                        className={styles.stats}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div>
                          <p className={styles.stat}>Shots</p>
                          <p className={styles.statValue}>6</p>
                        </div>
                        <div>
                          <p className={styles.stat}>xG</p>
                          <p className={styles.statValue}>1.42</p>
                        </div>
                      </motion.div>
                    </motion.div>
                )}
            </div>
            </AnimatePresence>
            
        </section>
    );
}