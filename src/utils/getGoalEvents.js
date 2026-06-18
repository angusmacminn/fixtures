function getLastName(fullName) {
  if (!fullName) return "";
  const parts = String(fullName).trim().split(/\s+/);
  return parts[parts.length - 1] ?? "";
}

function findOwnGoalScorer(gameData, ownGoalForEvent) {
  const relatedIds = ownGoalForEvent.related_events ?? [];
  const against = gameData.find(
    (event) =>
      event.type?.name === "Own Goal Against" &&
      (relatedIds.includes(event.id) ||
        event.related_events?.includes(ownGoalForEvent.id)),
  );
  return against?.player?.name;
}

export function getGoalsFromEvents(gameData = []) {
  const goals = [];

  for (const event of gameData) {
    if (event.type?.name === "Shot" && event.shot?.outcome?.name === "Goal") {
      goals.push({
        key:
          event.id ??
          `${event.team?.name ?? "team"}-${event.minute ?? 0}-${event.second ?? 0}`,
        team: event.team?.name,
        minute: event.minute ?? 0,
        second: event.second ?? 0,
        lastName: getLastName(event.player?.name),
        isOwnGoal: false,
      });
    } else if (event.type?.name === "Own Goal For") {
      goals.push({
        key:
          event.id ??
          `${event.team?.name ?? "team"}-${event.minute ?? 0}-${event.second ?? 0}-og`,
        team: event.team?.name,
        minute: event.minute ?? 0,
        second: event.second ?? 0,
        lastName: getLastName(findOwnGoalScorer(gameData, event)),
        isOwnGoal: true,
      });
    }
  }

  return goals.sort(
    (a, b) => a.minute - b.minute || a.second - b.second,
  );
}
