export function getRandomMatchId(matches) {
  if (!matches?.length) return null;

  const index = Math.floor(Math.random() * matches.length);
  return matches[index].match_id;
}
