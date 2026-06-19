"use client";

import { useEffect, useState } from "react";
import MatchHeader from "@/components/MatchHeader";
import MatchHeaderSkeleton from "@/components/skeleton/MatchHeaderSkeleton";
import GameMatchTabSkeleton from "@/components/skeleton/GameMatchTabSkeleton";
import Skeleton from "@/components/skeleton/Skeleton";
import styles from "@/styles/Home.module.scss";
import skeletonStyles from "@/styles/GameViewSkeleton.module.scss";

export default function GameViewSkeleton({ headerData = null }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 800px)");
    const onChange = (event) => setIsDesktop(event.matches);
    setIsDesktop(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      className={`${styles.main} ${isDesktop ? styles.desktop : styles.mobile}`}
      aria-busy="true"
      aria-label="Loading match"
    >
      <div className={styles.stickyHeader}>
        <div className={styles.matchHeader}>
          {headerData ? (
            <MatchHeader
              matchData={headerData}
              gameData={[]}
              isDesktop={isDesktop}
            />
          ) : (
            <MatchHeaderSkeleton isDesktop={isDesktop} />
          )}
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.matchContent}>
          <div className={styles.tabNavWrap}>
            <div className={skeletonStyles.tabNavSkeleton}>
              <Skeleton variant="tab" />
              <Skeleton variant="tab" />
              <Skeleton variant="tab" />
            </div>
          </div>

          <div className={styles.tabContentShell}>
            <GameMatchTabSkeleton isDesktop={isDesktop} />
          </div>
        </div>
      </div>
    </section>
  );
}
