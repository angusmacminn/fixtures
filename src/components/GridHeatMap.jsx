export default function GridHeatMap({gameData, team}){
    const gridSize = 8;
    const cols = Math.ceil(120 / gridSize);
    const rows = Math.ceil(80 / gridSize);
    
    const gridCounts = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(0));
    
    // STEP 3: Count events in each cell
    gameData.forEach(event => {
        // Skip if no location data
        if (!event.location) return;
        
        // Skip if wrong team (if team filter is provided)
        if (team && event.team?.name !== team) return;
        
        // Extract coordinates
        const [x, y] = event.location;
        
        // Convert to grid cell indices
        const col = Math.floor(x / gridSize);
        const row = Math.floor(y / gridSize);
        
        // Safety check: ensure we're within grid bounds
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            gridCounts[row][col]++; // Increment counter for this cell
        }
    });

    // After the forEach loop, add:
const totalEvents = gridCounts.flat().reduce((sum, count) => sum + count, 0);
const maxCount = Math.max(...gridCounts.flat());
const activeCells = gridCounts.flat().filter(count => count > 0).length;

console.log(`Total events counted: ${totalEvents}`);
console.log(`Hottest cell has: ${maxCount} events`);
console.log(`Active cells: ${activeCells} / ${cols * rows}`);
    
    console.log('Grid after counting:', gridCounts);
    
    return <div>Grid Heat Map</div>
}