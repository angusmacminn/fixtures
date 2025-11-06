import MatchVis from "@/components/MatchVis";
import data from '../../data/GameData.json';

export default function Game() {

    const shots = data.filter(event => event.type.name === "Shot");
    console.log(shots)

    return (
        <div>
            <h1>Arsenal vs Manchester United</h1>
            <MatchVis />
        </div>
    )
}