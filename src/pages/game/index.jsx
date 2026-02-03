"use client";

import MatchHeader from '@/components/MatchHeader';
import matchInfo from '../../data/15-16-PLFixtures.json';
import data from '../../data/GameData.json';
import styles from "@/styles/Home.module.scss";
import ShotMap from '@/components/match/ShotMap';
import Stats from '@/components/match/Stats';
import GridHeatMap from '@/components/heatmaps/GridHeatMap';
import { getMatchColors } from '@/data/teamColours';
import { motion, useAnimate, useMotionValue, useTransform } from "motion/react"
import ThreeDGridHeatMap from '@/components/heatmaps/3DGridHeatMap';

import { useEffect, useState } from 'react';
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
    // state for 3D heat map selection
    const [threeDeeView, setThreeDeeView] = useState(false);

    const viewMode = threeDeeView ? "3D" : "2D";

    
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


    
    const progress = useMotionValue(threeDeeView ? 1 : 0);
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const controls = animate(progress, threeDeeView ? 1 : 0, {
            duration: 0.6,
            ease: "easeInOut"
        });
        return () => controls.stop();
    }, [threeDeeView, animate, progress]);

    const opacity2D = useTransform(progress, [0, 1], [1, 0]);
    const opacity3D = useTransform(progress, [0, 1], [0, 1]);
    const scale2D = useTransform(progress, [0, 1], [1, 0.95]);
    const rotateX2D = useTransform(progress, [0, 1], [0, 15]);
    const scale3D = useTransform(progress, [0, 1], [0.95, 1]);
    const rotateX3D = useTransform(progress, [0, 1], [-15, 0]);
    const pointerEvents2D = useTransform(progress, [0, 0.3], ['auto', 'none']);
    const pointerEvents3D = useTransform(progress, [0.3, 1], ['none', 'auto']);

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
                        threeDeeView={threeDeeView}
                        onThreeDeeViewChange={setThreeDeeView}
                    />
                <div
                    ref={scope}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '1000px',
                        aspectRatio: '3 / 2',
                        margin: '0 auto',
                        padding: '0 1rem',
                        perspective: 800,
                        overflow: 'hidden',
                    }}
                >
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: opacity2D,
                            scale: scale2D,
                            rotateX: rotateX2D,
                            transformOrigin: 'center center',
                            pointerEvents: pointerEvents2D,
                        }}
                    >
                        <GridHeatMap 
                            gameData={data}
                            team={teamFilter}
                            color={teamColor}
                            eventType={selectedEventType}
                            minute={heatMapMinute}
                        />
                    </motion.div>
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: opacity3D,
                            scale: scale3D,
                            rotateX: rotateX3D,
                            transformOrigin: 'center center',
                            pointerEvents: pointerEvents3D,
                        }}
                    >
                        <ThreeDGridHeatMap
                            gameData={data}
                            team={teamFilter}
                            color={teamColor}
                            eventType={selectedEventType}
                            minute={heatMapMinute}
                        />
                    </motion.div>
                </div>

                    <TimeSlider minute={heatMapMinute} onChange={setHeatMapMinute} />
                </div>
            )}
            
            {activeTab === 'lineup' && (
                <div style={{ padding: '2rem', color: '#666' }}>Lineup coming soon</div>
            )}
            
            
        </section>
    );
}
