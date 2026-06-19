/**
 * Build a lookup of StatsBomb player nicknames from lineups JSON.
 * Keys: player_id (number) and player_name (string).
 */
export default function buildPlayerNicknameMap(lineups) {
  const map = {};

  if (!Array.isArray(lineups)) return map;

  for (const team of lineups) {
    for (const player of team?.lineup ?? []) {
      const nickname = player?.player_nickname?.trim();
      if (!nickname) continue;

      if (player.player_id != null) {
        map[player.player_id] = nickname;
      }
      if (player.player_name) {
        map[player.player_name] = nickname;
      }
    }
  }

  return map;
}
