"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/HeroHeatMap.module.scss";

const HERO_MATCH_ID = 3754058;
const MOBILE_BREAKPOINT = 700;

const ThreeDGridHeatMap = dynamic(
  () => import("@/components/heatmaps/3DGridHeatMap"),
  { ssr: false }
);

export default function HeroHeatMap({ matchId = HERO_MATCH_ID }) {
  const containerRef = useRef(null);
  const [gameData, setGameData] = useState([]);
  const [variant, setVariant] = useState("hero");
  const [hasSize, setHasSize] = useState(false);

  useEffect(() => {
    fetch(`/api/match/${matchId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setGameData)
      .catch(() => setGameData([]));
  }, [matchId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLayout = (width) => {
      setVariant(width < MOBILE_BREAKPOINT ? "heroMobile" : "hero");
      setHasSize(width > 0);
    };

    const observer = new ResizeObserver(([entry]) => {
      updateLayout(entry.contentRect.width);
    });

    observer.observe(container);
    updateLayout(container.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.heroHeatMap}>
      {hasSize && (
        <ThreeDGridHeatMap
          key={variant}
          gameData={gameData}
          eventType="Pass"
          minute={90}
          interactive={true}
          variant={variant}
        />
      )}
    </div>
  );
}
