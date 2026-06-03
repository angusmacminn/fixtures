const STATSBOMB_EVENTS_URL =
  "https://cdn.jsdelivr.net/gh/statsbomb/open-data@master/data/events";

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
    const url = `${STATSBOMB_EVENTS_URL}/${id}.json`;
    const response = await fetch(url);

    if (response.status === 404) {
      return res.status(404).json({ message: "Match events not found" });
    }
    if (!response.ok) {
      throw new Error(`StatsBomb fetch failed: ${response.status}`);
    }

    const events = await response.json();

    // Optional later: trim here before sending to client
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    return res.status(200).json(events);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load match data" });
  }
}