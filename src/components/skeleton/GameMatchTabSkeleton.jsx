import Skeleton from "@/components/skeleton/Skeleton";
import styles from "@/styles/Home.module.scss";
import skeletonStyles from "@/styles/GameViewSkeleton.module.scss";

export default function GameMatchTabSkeleton({ isDesktop }) {
  return (
    <div
      className={`${styles.matchStats} ${isDesktop ? styles.matchStatsLayout : ""}`}
    >
      <div className={styles.shotmapComponent}>
        <div className={skeletonStyles.shotMapSkeleton}>
          <div className={skeletonStyles.shotMapHeaderSkeleton}>
            <div className={skeletonStyles.shotMapHeaderText}>
              <Skeleton variant="title" width="40%" />
              <Skeleton variant="text" width="55%" />
              <Skeleton variant="text" width="70%" />
            </div>
            <div className={skeletonStyles.teamSelectorSkeleton}>
              <Skeleton variant="tab" width="3.5rem" />
              <Skeleton variant="tab" width="3.5rem" />
              <Skeleton variant="tab" width="3.5rem" />
            </div>
          </div>
          <Skeleton variant="pitch" />
          <Skeleton variant="slider" />
        </div>
      </div>

      <div className={styles.matchStatsComponent}>
        <div className={skeletonStyles.statsSkeleton}>
          <div className={skeletonStyles.statsHeaderSkeleton}>
            <Skeleton variant="title" width="5rem" />
            {isDesktop && (
              <div className={skeletonStyles.teamLabelsSkeleton}>
                <Skeleton variant="text" width="2.5rem" />
                <span aria-hidden="true" />
                <Skeleton variant="text" width="2.5rem" style={{ justifySelf: "end" }} />
              </div>
            )}
          </div>
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} variant="statRow" />
          ))}
        </div>
      </div>
    </div>
  );
}
