"use client";

import MatchHeader from '@/components/MatchHeader';
import matchInfo from '../../data/15-16-PLFixtures.json';
import data from '../../data/GameData.json';
import styles from "@/styles/Home.module.scss";
import ShotMap from '@/components/ShotMap';

export default function Game() {
    

    // filter match and team data to send to header
    const headerData = matchInfo.find(event => event.match_id === 3754171)
    // console.log('MatchInfo:', headerData)

    
    
    return (
        <section className={styles.main}>

            <MatchHeader matchData={headerData} gameData={data}/>
            <ShotMap gameData={data}/>
            
            
        </section>
    );
}