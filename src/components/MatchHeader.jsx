import styles from "@/styles/MatchHeader.module.scss";
import { motion, AnimatePresence } from 'motion/react'

export default function MatchHeader( {matchData} ){

    const homeTeamName = matchData.home_team.home_team_name
    const homeTeamScore = matchData.home_score
    console.log(homeTeamScore)
    
    const awayTeamName = matchData.away_team.away_team_name
    const awayTeamScore = matchData.away_score


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
                        <span className={styles.teamName}>{homeTeamName}</span>
                        <span className={styles.score}>{homeTeamScore}</span>
                    </div>
    
                    <div className={styles.divider}>
                        <span className={styles.vs}>:</span>
                    </div>
    
                    <div className={styles.teamSection}>
                        <span className={styles.score}>{awayTeamScore}</span>
                        <span className={styles.teamName}>{awayTeamName}</span>
                    </div>
                </div>

            </div>
        </motion.div>
        </div>
    )
}