"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import matchInfo from "@/data/15-16-PLFixtures.json";
import GameView from "@/components/game/GameView";

export default function GamePage() {
  const router = useRouter();
  const { matchId } = router.query;

  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const id = matchId ? Number(matchId) : null;
  const headerData = id ? matchInfo.find((m) => m.match_id === id) : null;

  useEffect(() => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/match/${matchId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load match");
        return res.json();
      })
      .then(setGameData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [matchId]);

  if (!router.isReady) return <div>Loading…</div>;
  if (!headerData) return <div>Match not found in fixtures list</div>;
  if (loading) return <div>Loading match data…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gameData) return <div>No match data</div>;

  return (
    <GameView
      key={id}
      matchId={id}
      headerData={headerData}
      gameData={gameData ?? []}
    />
  );
}
