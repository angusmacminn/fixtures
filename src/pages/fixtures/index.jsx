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
    }),[]

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!matchData) return <div>No data</div>;

    const data = matchData.data;

    return(
        <div>
            <h1>{data.name}</h1>
            <pre>{JSON.stringify(matchData, null, 2)}</pre>
        </div>
    )
}