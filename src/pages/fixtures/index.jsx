import { useState, useEffect } from "react"



export default function Fixtures(){
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // fetch from api route
        fetch('/api/sportsmonks')
            .then(res => res.json())
            .then(data => {
                setMatchData(data)
                setLoading(false)
            })
            .catch( err => {
                setError(error.message)
                setLoading(false)
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!matchData) return <div>No data</div>;

    // object property access using dot notation 
    const fixtureData = matchData.data;

    // Split stats by home/away
    // filter loops through each element in fixtureData, creates a new array for home and away
    // in each 'stat', function returns either true or false
    const home = fixtureData.statistics.filter(stat => stat.location === "home");
    const away = fixtureData.statistics.filter(stat => stat.location === "away");

    console.log(home)

    // function to find stat by type name
    const getStat = (statsArray, typeName) => {
        const stat = statsArray.find(stat => stat.type?.name === typeName);
        return stat?.data?.value || 0;
    };

    // Extract home team stats
    const homeGoals = getStat(home, "Goals");
    const homeCorners = getStat(home, "Corners");
    const homePossession = getStat(home, "Ball Possession %");
    const homeYellowCards = getStat(home, "Yellowcards");
    const homeAssists = getStat(home, "Assists");
    const homeDribbleSuccess = getStat(home, "Successful Dribbles Percentage");

    // Extract away team stats
    const awayGoals = getStat(away, "Goals");
    const awayCorners = getStat(away, "Corners");
    const awayPossession = getStat(away, "Ball Possession %");
    const awayYellowCards = getStat(away, "Yellowcards");
    const awayAssists = getStat(away, "Assists");
    const awayDribbleSuccess = getStat(away, "Successful Dribbles Percentage");

    return(
        <div>
            <h1>{fixtureData.name}</h1>
            <h2>{homeGoals}</h2>
        </div>
    )
}