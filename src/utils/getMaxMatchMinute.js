export default function getMaxMatchMinute(gameData = []) {
  const maxEventMinute = gameData.reduce(
    (max, event) => Math.max(max, event?.minute ?? 0),
    0,
  );
  return Math.max(90, maxEventMinute);
}
