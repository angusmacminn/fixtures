export const teamColors = {
    "Arsenal": "#EF0107",
    "Aston Villa": "#670E36",
    "AFC Bournemouth": "#DA291C",
    "Chelsea": "#034694",
    "Crystal Palace": "#1B458F",
    "Everton": "#003399",
    "Leicester City": "#003090",
    "Liverpool": "#C8102E",
    "Manchester City": "#6CABDD",
    "Manchester United": "#DA291C",
    "Newcastle United": "#241F20",
    "Norwich City": "#FFF200",
    "Southampton": "#D71920",
    "Stoke City": "#E03A3E",
    "Sunderland": "#EB172B",
    "Swansea City": "#231F20",
    "Tottenham Hotspur": "#132257",
    "Watford": "#FBEE23",
    "West Bromwich Albion": "#122F67",
    "West Ham United": "#7A263A"
  };
  
  // Helper function to get team color
  export const getTeamColor = (teamName) => {
    return teamColors[teamName] || "#000000"; // Default to black if team not found
  };
  
  // Optional: Get color with opacity
  export const getTeamColorWithOpacity = (teamName, opacity = 1) => {
    const hex = teamColors[teamName] || "#000000";
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };