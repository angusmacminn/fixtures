import styles from "@/styles/MatchHeader.module.scss";
import { motion, AnimatePresence } from 'motion/react'
import { getTeamAcronym } from "@/data/teamAcronyms";
import { useState, useEffect } from "react";

export default function MatchHeader( {matchData, gameData} ){

    const homeTeamName = matchData.home_team.home_team_name
    const homeTeamScore = matchData.home_score
    const awayTeamName = matchData.away_team.away_team_name
    const awayTeamScore = matchData.away_score
    const stadium = matchData.stadium.name

    const goalScorers = gameData.filter(event => 
        event.type?.name === 'Shot' &&
        event.shot?.outcome?.name === 'Goal'
    )
    .map(goal => ({
        lastName: goal.player?.name.trim().split(" ").pop(),
        minute: goal.minute,
        team: goal.team?.name
    }))

    console.log(goalScorers)

    // detect if using mobile
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // use acronym on mobile
    const displayHomeTeam = isMobile ? getTeamAcronym(homeTeamName) : homeTeamName
    const displayAwayTeam = isMobile ? getTeamAcronym(awayTeamName) : awayTeamName

    return(
        <div className={styles.matchHeader}>
            <motion.div 
            // className={styles.matchHeader}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className={styles.headerContent}>
                <div className={styles.scorebug}>
                    <div className={styles.teamSection}>
                        <span className={styles.teamName}>{displayHomeTeam}</span>
                        <span className={styles.score}>{homeTeamScore}</span>
                    </div>
    
                    <div className={styles.divider}>
                        <span className={styles.vs}>:</span>
                    </div>
    
                    <div className={styles.teamSection}>
                        <span className={styles.score}>{awayTeamScore}</span>
                        <span className={styles.teamName}>{displayAwayTeam}</span>
                    </div>
                </div>
                <div className={styles.stadium}>
                    <span className={styles.stadiumName}>{stadium}</span>
                </div>
            </div>
        </motion.div>
        </div>
    )
}