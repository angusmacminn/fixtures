"use client";

import { useRouter } from "next/router";
import styles from "@/styles/Home.module.scss";
import { getRandomMatchId } from "@/utils/getRandomMatchId";

export default function RandomGameButton({ matches }) {
  const router = useRouter();

  const openRandomGame = () => {
    const matchId = getRandomMatchId(matches);
    if (matchId != null) {
      router.push(`/game/${matchId}`);
    }
  };

  return (
    <button
      type="button"
      className={styles.heroButton}
      onClick={openRandomGame}
    >
      Random Match
    </button>
  );
}
