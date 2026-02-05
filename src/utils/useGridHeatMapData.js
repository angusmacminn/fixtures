// useGridHeatmapData.js
export default function useGridHeatmapData(gameData, { team, eventType, minute = 90, flipX = false }) {
    const gridSize = 5;
    const cols = Math.ceil(120 / gridSize);
    const rows = Math.ceil(80 / gridSize);
  
    const gridCounts = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0));
  
    gameData.forEach(event => {
      if (!event.location) return;
      const eventMin = event.minute != null ? event.minute : 0;
      if (eventMin > minute) return;
      if (team && event.team?.name !== team) return;
      if (event.type && event.type?.name !== eventType) return;
  
      let [x, y] = event.location;
      // Normalize attacking direction (e.g. flip away team) so the selected team
      // always attacks the same way in the visualization.
      if (flipX) x = 120 - x;
      const col = Math.floor(x / gridSize);
      const row = Math.floor(y / gridSize);
  
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        gridCounts[row][col]++;
      }
    });
  
    const maxCount = Math.max(...gridCounts.flat(), 1); // avoid div by 0
    const totalEvents = gridCounts.flat().reduce((sum, c) => sum + c, 0);
    const activeCells = gridCounts.flat().filter(c => c > 0).length;
  
    return { gridCounts, gridSize, cols, rows, maxCount, totalEvents, activeCells };
  }