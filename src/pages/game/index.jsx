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
import TeamSelector from '@/components/TeamSelector';


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

    // Heatmaps don’t support "both" selection; if you come from the match tab
    // with "both" selected, snap back to home.
    useEffect(() => {
        if (activeTab === "heatmaps" && selectedTeam === "both") {
            setSelectedTeam("home");
        }
    }, [activeTab, selectedTeam]);

    // normalize attacking direction for heatmaps.
    // When the selected team is the away team, mirror the X coordinate so the
    // selected team always attacks in the same direction.
    const flipHeatmapX = teamFilter != null && teamFilter === awayTeam;

    
    const progress = useMotionValue(threeDeeView ? 1 : 0);
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const controls = animate(progress, threeDeeView ? 1 : 0, {
            duration: 0.6,
            ease: [0.65, 0, 0.35, 1]
        });
        return () => controls.stop();
    }, [threeDeeView, animate, progress]);

    const rotateXContainer = useTransform(progress, [0, 1], [0, 25]);
    const scaleContainer = useTransform(progress, [0, 1], [1, 0.98]);
    const translateY = useTransform(progress, [0, 1], [0, -10]);
    const opacity2D = useTransform(progress, [0, 1], [1, 0]);
    const opacity3D = useTransform(progress, [0, 1], [0, 1]);
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
                    <TeamSelector
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        value={selectedTeam}
                        onChange={setSelectedTeam}
                        layoutId="shotTeamPill"
                    />
                </>
            )}
            
            {activeTab === 'heatmaps' && (
                <div className={styles.heatmapsContainer}>
                    
                    <HeatMapControls 
                        selectedEventType={selectedEventType}
                        onEventTypeChange={setSelectedEventType}
                        threeDeeView={threeDeeView}
                        onThreeDeeViewChange={setThreeDeeView}
                    />
                <motion.div
                    ref={scope}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '1000px',
                        aspectRatio: '3 / 2',
                        perspective: 800,
                        rotateX: rotateXContainer,
                        scale: scaleContainer,
                        y: translateY,
                        transformOrigin: 'center center',
                    }}
                >
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: opacity2D,
                            pointerEvents: pointerEvents2D,
                        }}
                    >
                        <GridHeatMap 
                            gameData={data}
                            team={teamFilter}
                            color={teamColor}
                            eventType={selectedEventType}
                            minute={heatMapMinute}
                            flipX={flipHeatmapX}
                        />
                    </motion.div>
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: opacity3D,
                            pointerEvents: pointerEvents3D,
                        }}
                    >
                        <ThreeDGridHeatMap
                            gameData={data}
                            team={teamFilter}
                            color={teamColor}
                            eventType={selectedEventType}
                            minute={heatMapMinute}
                            flipX={flipHeatmapX}
                        />
                    </motion.div>
                </motion.div>
                    <TimeSlider minute={heatMapMinute} onChange={setHeatMapMinute} />
                    <TeamSelector
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        value={selectedTeam}
                        onChange={setSelectedTeam}
                        layoutId="heatmapTeamPill"
                        showBoth={false}
                    />
                </div>
            )}
            
            {activeTab === 'lineup' && (
                <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Lineup coming soon</div>
            )}
            
            
        </section>
    );
}
