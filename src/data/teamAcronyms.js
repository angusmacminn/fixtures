export const teamAcronyms = {
    "Arsenal": "ARS",
    "Aston Villa": "AVL",
    "AFC Bournemouth": "BOU",
    "Chelsea": "CHE",
    "Crystal Palace": "CRY",
    "Everton": "EVE",
    "Leicester City": "LEI",
    "Liverpool": "LIV",
    "Manchester City": "MCI",
    "Manchester United": "MUN",
    "Newcastle United": "NEW",
    "Norwich City": "NOR",
    "Southampton": "SOU",
    "Stoke City": "STK",
    "Sunderland": "SUN",
    "Swansea City": "SWA",
    "Tottenham Hotspur": "TOT",
    "Watford": "WAT",
    "West Bromwich Albion": "WBA",
    "West Ham United": "WHU"
  };
  
  // Helper function to get acronym
  export const getTeamAcronym = (teamName) => {
    return teamAcronyms[teamName] || teamName;
  };