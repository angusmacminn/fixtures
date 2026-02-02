"use client";

import MatchHeader from '@/components/MatchHeader';
import matchInfo from '../../data/15-16-PLFixtures.json';
import data from '../../data/GameData.json';
import styles from "@/styles/Home.module.scss";
import ShotMap from '@/components/match/ShotMap';
import Stats from '@/components/match/Stats';
import GridHeatMap from '@/components/heatmaps/GridHeatMap';
import { getMatchColors } from '@/data/teamColours';


import { useState } from 'react';
import HeatMapControls from '@/components/heatmaps/HeatMapControls';
import TimeSlider from '@/components/TimeSlider';
import TabNavigation from '@/components/TabNavigation';


export default function Game() {
    // state for team selection
    const [selectedTeam, setSelectedTeam] = useState("home"); // "home" | "away" | "both"
    // state for event selection
    const [selectedEventType, setSelectedEventType] = useState("Pass")
    // state for minute selection for slider (ShotMap)
    const [selectedMinute, setSelectedMinute] = useState(90)
    // state for heat map time slider – cells animate in/out as this progresses
    const [heatMapMinute, setHeatMapMinute] = useState(90)
    // state for tab selection
    const [activeTab, setActiveTab] = useState('match');
    
    // filter match and team data to send to header
    const headerData = matchInfo.find(event => event.match_id === 3754171)
    
    const homeTeam = headerData.home_team.home_team_name
    const awayTeam = headerData.away_team.away_team_name
    

    // Get non-clashing colors
    const colors = getMatchColors(homeTeam, awayTeam);
    // console.log(colors)

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
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab}/>   
            
            {activeTab === 'match' && (
                <>
                    <Stats gameData={data} homeTeam={homeTeam} awayTeam={awayTeam} />
                    <ShotMap 
                        gameData={data} 
                        team={teamFilter} 
                        minute={selectedMinute}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                    />
                    <TimeSlider minute={selectedMinute} onChange={setSelectedMinute}/> 
                </>
            )}
            
            {activeTab === 'heatmaps' && (
                <div className={styles.heatmapsContainer}>
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
                        minute={heatMapMinute}
                    />
                    <TimeSlider minute={heatMapMinute} onChange={setHeatMapMinute} />
                </div>
            )}
            
            {activeTab === 'lineup' && (
                <div style={{ padding: '2rem', color: '#666' }}>Lineup coming soon</div>
            )}
            
            
        </section>
    );
}
