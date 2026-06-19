import Skeleton from "@/components/skeleton/Skeleton";
import headerStyles from "@/styles/MatchHeader.module.scss";
import skeletonStyles from "@/styles/GameViewSkeleton.module.scss";

export default function MatchHeaderSkeleton({ isDesktop }) {
  return (
    <div
      className={`${headerStyles.matchHeader} ${isDesktop ? headerStyles.desktop : ""} ${skeletonStyles.matchHeaderSkeleton}`}
    >
      <div className={headerStyles.metaRow}>
        <Skeleton variant="text" width="45%" />
        <Skeleton variant="text" width="28%" />
      </div>
      <div className={headerStyles.separator} />
      <div className={headerStyles.scoreRow}>
        <Skeleton variant="title" width={isDesktop ? "8rem" : "3.5rem"} />
        <Skeleton variant="title" width="4.5rem" />
        <Skeleton variant="title" width={isDesktop ? "8rem" : "3.5rem"} />
      </div>
    </div>
  );
}
