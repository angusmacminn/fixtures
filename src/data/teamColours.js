export const teamColors = {
    "Arsenal": { primary: "#EF0107", secondary: "#FFFFFF" },
    "Aston Villa": { primary: "#670E36", secondary: "#95BFE5" },
    "AFC Bournemouth": { primary: "#DA291C", secondary: "#000000" },
    "Chelsea": { primary: "#034694", secondary: "#FFFFFF" },
    "Crystal Palace": { primary: "#1B458F", secondary: "#C4122E" },
    "Everton": { primary: "#003399", secondary: "#FFFFFF" },
    "Leicester City": { primary: "#003090", secondary: "#FDBE11" },
    "Liverpool": { primary: "#C8102E", secondary: "#00B2A9" },
    "Manchester City": { primary: "#6CABDD", secondary: "#1C2C5B" },
    "Manchester United": { primary: "#DA291C", secondary: "#FFE500" },
    "Newcastle United": { primary: "#241F20", secondary: "#FFFFFF" },
    "Norwich City": { primary: "#FFF200", secondary: "#00A650" },
    "Southampton": { primary: "#D71920", secondary: "#130C0E" },
    "Stoke City": { primary: "#E03A3E", secondary: "#1B449C" },
    "Sunderland": { primary: "#EB172B", secondary: "#000000" },
    "Swansea City": { primary: "#231F20", secondary: "#FFFFFF" },
    "Tottenham Hotspur": { primary: "#132257", secondary: "#FFFFFF" },
    "Watford": { primary: "#FBEE23", secondary: "#ED2127" },
    "West Bromwich Albion": { primary: "#122F67", secondary: "#FFFFFF" },
    "West Ham United": { primary: "#7A263A", secondary: "#1BB1E7" }
  };

  // RGB distance to detect clashing colors
  const colorDistance = (hex1, hex2) => {
    const r1 = parseInt(hex1.slice(1, 3), 16);
    const g1 = parseInt(hex1.slice(3, 5), 16);
    const b1 = parseInt(hex1.slice(5, 7), 16);
    const r2 = parseInt(hex2.slice(1, 3), 16);
    const g2 = parseInt(hex2.slice(3, 5), 16);
    const b2 = parseInt(hex2.slice(5, 7), 16);
    return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
  };

  // Get non-clashing colors for two teams
  export const getMatchColors = (homeTeam, awayTeam) => {
    const home = teamColors[homeTeam] || { primary: "#000000", secondary: "#666666" };
    const away = teamColors[awayTeam] || { primary: "#000000", secondary: "#666666" };
    
    // If primaries clash, away team uses secondary
    if (colorDistance(home.primary, away.primary) < 100) {
      return { home: home.primary, away: away.secondary };
    }
    return { home: home.primary, away: away.primary };
  };
  
  // Helper function to get team color (returns primary)
  export const getTeamColor = (teamName) => {
    return teamColors[teamName]?.primary || "#000000";
  };
  
  // Get color with opacity
  export const getTeamColorWithOpacity = (teamName, opacity = 1) => {
    const hex = teamColors[teamName]?.primary || "#000000";
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };