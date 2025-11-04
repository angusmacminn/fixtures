import { useState, useEffect } from "react"
import MatchVis from "@/components/MatchVis";
import styles from "@/styles/Home.module.scss";
import * as THREE from "three";


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
    console.log(fixtureData)

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

    const matchStats = {
        // home team stats
        homeGoals: getStat(home, "Goals"),
        homeCorners: getStat(home, "Corners"),
        homePossession: getStat(home, "Ball Possession %"),
        homeYellowCards: getStat(home, "Yellowcards"),
        homeAssists: getStat(home, "Assists"),
        homeDribbleSuccess: getStat(home, "Successful Dribbles Percentage"),

        // away team stats
        awayGoals: getStat(away, "Goals"),
        awayCorners: getStat(away, "Corners"),
        awayPossession: getStat(away, "Ball Possession %"),
        awayYellowCards: getStat(away, "Yellowcards"),
        awayAssists: getStat(away, "Assists"),
        awayDribbleSuccess: getStat(away, "Successful Dribbles Percentage"),
    }


    return(
        <section className={styles.container}>
            <h1>{fixtureData.name}</h1>
            <MatchVis matchStats={matchStats} />
            <div>
                <ul>
                    <li>Home Goals: {matchStats.homeGoals}</li>
                    <li>Away Goals: {matchStats.awayGoals}</li>
                    <li>Home Corners: {matchStats.homeCorners}</li>
                    <li>Away Corners: {matchStats.awayCorners}</li>
                    <li>Home Possession: {matchStats.homePossession}</li>
                    <li>Home Yellow Cards: {matchStats.homeYellowCards}</li>
                    <li>Home Assists: {matchStats.homeAssists}</li>
                    <li>Home Dribble Success: {matchStats.homeDribbleSuccess}</li>
                </ul>
                
            </div>
        </section>
    )
}