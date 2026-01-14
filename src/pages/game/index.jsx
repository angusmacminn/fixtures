"use client";

import MatchHeader from '@/components/MatchHeader';
import matchInfo from '../../data/15-16-PLFixtures.json';
import data from '../../data/GameData.json';
import styles from "@/styles/Home.module.scss";
import ShotMap from '@/components/ShotMap';
import GridHeatMap from '@/components/GridHeatMap';
import { getMatchColors } from '@/data/teamColours';


import { useState } from 'react';


export default function Game() {
    const [selectedTeam, setSelectedTeam] = useState("home"); // "home" | "away" | "both"

    
    // filter match and team data to send to header
    const headerData = matchInfo.find(event => event.match_id === 3754171)
    
    const homeTeam = headerData.home_team.home_team_name
    const awayTeam = headerData.away_team.away_team_name
    

    // Get non-clashing colors
    const colors = getMatchColors(homeTeam, awayTeam);
    console.log(colors)

    // Determine which team name to pass (or null for both)
    const teamFilter = selectedTeam === "home" ? homeTeam 
                     : selectedTeam === "away" ? awayTeam 
                     : null;
    
    const teamColor = selectedTeam === "home" ? colors.home 
                    : selectedTeam === "away" ? colors.away 
                    : null;

    
    
    
    return (
        <section className={styles.main}>

            <MatchHeader matchData={headerData} gameData={data}/>
            <ShotMap gameData={data}/>
            <div className={styles.teamSelector}>
                <button 
                    onClick={() => setSelectedTeam("home")}
                    style={{ background: selectedTeam === "home" ? colors.home : "transparent" }}
                >
                    {homeTeam}
                </button>
                <button 
                    onClick={() => setSelectedTeam("away")}
                    style={{ background: selectedTeam === "away" ? colors.away : "transparent" }}
                >
                    {awayTeam}
                </button>
            </div>
            <GridHeatMap 
                gameData={data}
                team={teamFilter}
                color={teamColor}
            />
            
            
        </section>
    );
}