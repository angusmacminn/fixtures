import useGridHeatmapData from '@/utils/useGridHeatMapData';


export default function ThreeDGridHeatMap({ gameData, team, color, eventType, minute = 90 }){
    const { gridCounts, gridSize, maxCount } = useGridHeatmapData(gameData, {
        team,
        eventType,
        minute
    });
    
    return (
        <div>
            3D Grid Heat Map coming soon
        </div>
    )
}