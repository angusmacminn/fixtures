const STATSBOMB_EVENTS_URL =
  "https://cdn.jsdelivr.net/gh/statsbomb/open-data@master/data/events";
const STATSBOMB_LINEUPS_URL =
  "https://cdn.jsdelivr.net/gh/statsbomb/open-data@master/data/lineups";

import buildPlayerNicknameMap from "@/utils/buildPlayerNicknameMap";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { matchId } = req.query;
  const id = Number(matchId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid matchId" });
  }

  try {
    const [eventsResponse, lineupsResponse] = await Promise.all([
      fetch(`${STATSBOMB_EVENTS_URL}/${id}.json`),
      fetch(`${STATSBOMB_LINEUPS_URL}/${id}.json`),
    ]);

    if (eventsResponse.status === 404) {
      return res.status(404).json({ message: "Match events not found" });
    }
    if (!eventsResponse.ok) {
      throw new Error(`StatsBomb events fetch failed: ${eventsResponse.status}`);
    }

    const events = await eventsResponse.json();
    let playerNicknames = {};

    if (lineupsResponse.ok) {
      const lineups = await lineupsResponse.json();
      playerNicknames = buildPlayerNicknameMap(lineups);
    }

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    return res.status(200).json({ events, playerNicknames });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load match data" });
  }
}