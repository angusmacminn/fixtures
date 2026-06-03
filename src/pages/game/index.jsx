"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const DEFAULT_MATCH_ID = 3754171;

export default function GameIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/game/${DEFAULT_MATCH_ID}`);
  }, [router]);

  return null;
}
