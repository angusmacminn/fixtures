"use client";

import MatchHeader from '@/components/MatchHeader';
import matchInfo from '../../data/15-16-PLFixtures.json';
import data from '../../data/GameData.json';
import styles from "@/styles/Home.module.scss";
import ShotMap from '@/components/ShotMap';
import GridHeatMap from '@/components/GridHeatMap';
import { getMatchColors } from '@/data/teamColours';


import { useState } from 'react';
import HeatMapControls from '@/components/HeatMapControls';


export default function Game() {
    // state for team selection
    const [selectedTeam, setSelectedTeam] = useState("home"); // "home" | "away" | "both"
    // state for event selection
    const [selectedEventType, setSelectedEventType] = useState("Pass")
    // state for minute selection for slider
    const [selectedMinute, setSelectedMinute] = useState(0)
    
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
            <ShotMap gameData={data} team={teamFilter} minute={selectedMinute}/>
            <HeatMapControls 
                teams={[homeTeam, awayTeam]}
                selectedTeam={teamFilter}
                onTeamChange={(team) => setSelectedTeam(team === homeTeam ? "home" : "away")}
                selectedEventType={selectedEventType}
                onEventTypeChange={setSelectedEventType}
            />
            <GridHeatMap 
                gameData={data}
                team={teamFilter}
                color={teamColor}
                eventType={selectedEventType}
            />
            
            
        </section>
    );
}