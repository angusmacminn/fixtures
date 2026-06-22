import getPlayerShortName from "@/utils/getPlayerShortName";

function isStarter(player) {
  return (player.positions ?? []).some(
    (position) => position.start_reason === "Starting XI"
  );
}

function getSubOnMinute(player) {
  const subOn = (player.positions ?? []).find((position) =>
    position.start_reason?.includes("Substitution - On")
  );
  return subOn?.from ?? null;
}

function formatSubMinute(timeStr) {
  if (!timeStr) return null;
  const [minutes] = timeStr.split(":");
  const parsed = Number.parseInt(minutes, 10);
  return Number.isFinite(parsed) ? `${parsed}'` : null;
}

function resolveNickname(player, playerNicknames) {
  const fromMap =
    playerNicknames[player.player_id] ??
    playerNicknames[player.player_name] ??
    null;
  return fromMap ?? player.player_nickname?.trim() ?? null;
}

function buildSubstitutesForTeam(teamLineup, playerNicknames) {
  const players = teamLineup?.lineup ?? [];

  return players
    .filter((player) => !isStarter(player))
    .map((player) => {
      const playerName = player.player_name;
      const nickname = resolveNickname(player, playerNicknames);
      const subOnTime = getSubOnMinute(player);

      return {
        playerName,
        nickname,
        lastName: getPlayerShortName(playerName, nickname),
        jerseyNumber: String(player.jersey_number ?? ""),
        subOnMinute: formatSubMinute(subOnTime),
      };
    })
    .sort(
      (a, b) =>
        Number(a.jerseyNumber) - Number(b.jerseyNumber) ||
        a.lastName.localeCompare(b.lastName)
    );
}

export default function buildSubstitutesFromLineups(
  lineups,
  homeTeamName,
  awayTeamName,
  playerNicknames = {}
) {
  if (!Array.isArray(lineups)) {
    return { home: [], away: [] };
  }

  const homeTeam = lineups.find((team) => team.team_name === homeTeamName);
  const awayTeam = lineups.find((team) => team.team_name === awayTeamName);

  return {
    home: buildSubstitutesForTeam(homeTeam, playerNicknames),
    away: buildSubstitutesForTeam(awayTeam, playerNicknames),
  };
}
