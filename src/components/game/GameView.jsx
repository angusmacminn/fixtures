"use client";

import MatchHeader from "@/components/MatchHeader";
import styles from "@/styles/Home.module.scss";
import ShotMap from "@/components/match/ShotMap";
import Stats from "@/components/match/Stats";
import GridHeatMap from "@/components/heatmaps/GridHeatMap";
import LineupPitch from "@/components/lineup/LineupPitch";
import { getMatchColors } from "@/data/teamColours";
import { motion, useAnimate, useMotionValue, useTransform } from "motion/react";
import ThreeDGridHeatMap from "@/components/heatmaps/3DGridHeatMap";
import { useEffect, useMemo, useState } from "react";
import getMaxMatchMinute from "@/utils/getMaxMatchMinute";
import HeatMapControls from "@/components/heatmaps/HeatMapControls";
import TimeSlider from "@/components/TimeSlider";
import TabNavigation from "@/components/TabNavigation";
import TeamSelector from "@/components/TeamSelector";

export default function GameView({ matchId, headerData, gameData = [], playerNicknames = {}, lineups = [] }) {
  const events = Array.isArray(gameData) ? gameData : [];
  const hasEvents = events.length > 0;
  const maxMinute = useMemo(() => getMaxMatchMinute(events), [events]);

  const [selectedTeam, setSelectedTeam] = useState("both");
  const [selectedEventType, setSelectedEventType] = useState("Pass");
  const [selectedMinute, setSelectedMinute] = useState(maxMinute);
  const [heatMapMinute, setHeatMapMinute] = useState(maxMinute);
  const [activeTab, setActiveTab] = useState("match");
  const [threeDeeView, setThreeDeeView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setActiveTab("match");
    setSelectedTeam("both");
    setSelectedMinute(maxMinute);
    setHeatMapMinute(maxMinute);
    setSelectedEventType("Pass");
    setThreeDeeView(false);
  }, [matchId, maxMinute]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 800px)");
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const homeTeam = headerData.home_team.home_team_name;
  const awayTeam = headerData.away_team.away_team_name;
  const colors = getMatchColors(homeTeam, awayTeam);

  const teamFilter =
    selectedTeam === "home"
      ? homeTeam
      : selectedTeam === "away"
        ? awayTeam
        : null;

  const teamColor =
    selectedTeam === "home"
      ? colors.home
      : selectedTeam === "away"
        ? colors.away
        : null;

  useEffect(() => {
    if (activeTab === "heatmaps" && selectedTeam === "both") {
      setSelectedTeam("home");
    }
  }, [activeTab, selectedTeam]);

  const flipHeatmapX = teamFilter != null && teamFilter === awayTeam;

  const progress = useMotionValue(threeDeeView ? 1 : 0);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const controls = animate(progress, threeDeeView ? 1 : 0, {
      duration: 0.6,
      ease: [0.65, 0, 0.35, 1],
    });
    return () => controls.stop();
  }, [threeDeeView, animate, progress]);

  const rotateXContainer = useTransform(progress, [0, 1], [0, 25]);
  const scaleContainer = useTransform(progress, [0, 1], [1, 0.98]);
  const translateY = useTransform(progress, [0, 1], [0, -10]);
  const opacity2D = useTransform(progress, [0, 1], [1, 0]);
  const opacity3D = useTransform(progress, [0, 1], [0, 1]);
  const pointerEvents2D = useTransform(progress, [0, 0.3], ["auto", "none"]);
  const pointerEvents3D = useTransform(progress, [0.3, 1], ["none", "auto"]);

  return (
    <section className={`${styles.main} ${isDesktop ? styles.desktop : styles.mobile}`}>
      <div className={styles.stickyHeader}>
        <div className={styles.matchHeader}>
          <MatchHeader
            matchData={headerData}
            gameData={events}
            isDesktop={isDesktop}
          />
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.matchContent}>
          <div className={styles.tabNavWrap}>
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isDesktop={isDesktop}
            />
          </div>

          <div className={styles.tabContentShell}>
          {activeTab === "match" && (
            <div
              className={`${styles.matchStats} ${
                isDesktop ? styles.matchStatsLayout : ""
              }`}
            >
              <div className={styles.shotmapComponent}>
                {hasEvents ? (
                  <>
                    <ShotMap
                      gameData={events}
                      team={teamFilter}
                      minute={selectedMinute}
                      homeTeam={homeTeam}
                      awayTeam={awayTeam}
                      selectedTeam={selectedTeam}
                      setSelectedTeam={setSelectedTeam}
                    />
                    <TimeSlider
                      minute={selectedMinute}
                      onChange={setSelectedMinute}
                      maxMinute={maxMinute}
                    />
                  </>
                ) : (
                  <p>No event data for this match.</p>
                )}
              </div>
              <div className={styles.matchStatsComponent}>
                {hasEvents ? (
                  <Stats
                    gameData={events}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                    isDesktop={isDesktop}
                  />
                ) : null}
              </div>
            </div>
          )}

          {activeTab === "heatmaps" && (
            <div className={styles.heatmapsContainer}>
              <div className={styles.heatmapControlsContainer}>
                <TeamSelector
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  value={selectedTeam}
                  onChange={setSelectedTeam}
                  layoutId="heatmapTeamPill"
                  showBoth={false}
                  variant="heatmapVariant"
                />
                <HeatMapControls
                  selectedEventType={selectedEventType}
                  onEventTypeChange={setSelectedEventType}
                  threeDeeView={threeDeeView}
                  onThreeDeeViewChange={setThreeDeeView}
                />
              </div>
              {hasEvents ? (
                <>
                  <motion.div
                    ref={scope}
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "1000px",
                      aspectRatio: "3 / 2",
                      perspective: 800,
                      rotateX: rotateXContainer,
                      scale: scaleContainer,
                      y: translateY,
                      transformOrigin: "center center",
                    }}
                  >
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: opacity2D,
                        pointerEvents: pointerEvents2D,
                      }}
                    >
                      <GridHeatMap
                        gameData={events}
                        team={teamFilter}
                        color={teamColor}
                        eventType={selectedEventType}
                        minute={heatMapMinute}
                        flipX={flipHeatmapX}
                      />
                    </motion.div>
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: opacity3D,
                        pointerEvents: pointerEvents3D,
                      }}
                    >
                      <ThreeDGridHeatMap
                        gameData={events}
                        team={teamFilter}
                        color={teamColor}
                        eventType={selectedEventType}
                        minute={heatMapMinute}
                        flipX={flipHeatmapX}
                        interactive={threeDeeView}
                      />
                    </motion.div>
                  </motion.div>
                  <TimeSlider
                    minute={heatMapMinute}
                    onChange={setHeatMapMinute}
                    maxMinute={maxMinute}
                    variant="heatmapVariant"
                  />
                </>
              ) : (
                <p>No event data for this match.</p>
              )}
            </div>
          )}

          {activeTab === "lineup" && (
            <div className={styles.lineupSection}>
              <div className={styles.lineupPitchArea}>
                {hasEvents ? (
                  <LineupPitch
                    gameData={events}
                    homeTeamName={homeTeam}
                    awayTeamName={awayTeam}
                    playerNicknames={playerNicknames}
                    lineups={lineups}
                  />
                ) : (
                  <p>No event data for this match.</p>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
