"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import matchInfo from "@/data/15-16-PLFixtures.json";
import GameView from "@/components/game/GameView";
import GameViewSkeleton from "@/components/skeleton/GameViewSkeleton";

export default function GamePage() {
  const router = useRouter();
  const { matchId } = router.query;

  const [gameData, setGameData] = useState(null);
  const [playerNicknames, setPlayerNicknames] = useState({});
  const [lineups, setLineups] = useState([]);
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
      .then((data) => {
        if (Array.isArray(data)) {
          setGameData(data);
          setPlayerNicknames({});
          setLineups([]);
          return;
        }
        setGameData(data.events ?? []);
        setPlayerNicknames(data.playerNicknames ?? {});
        setLineups(data.lineups ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [matchId]);

  if (!router.isReady || loading) {
    return <GameViewSkeleton headerData={headerData} />;
  }
  if (!headerData) return <div>Match not found in fixtures list</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gameData) return <div>No match data</div>;

  return (
    <GameView
      key={id}
      matchId={id}
      headerData={headerData}
      gameData={gameData ?? []}
      playerNicknames={playerNicknames}
      lineups={lineups}
    />
  );
}
