import { Floor } from "./types";

function NoiseLevelButton({noiseNumber}: {noiseNumber : number}) {
    return( 
        <button>
            {noiseNumber}
        </button>
    );
}

function CalculateCurrentNoiseLevel({cFloor}: {cFloor : Floor}) {
    let i = 0;
    for (const n of cFloor.noiseReports) {
        i += n.noiseLevel;
    }
    i /= cFloor.noiseReports.length;
    return (
        <p> Current noise level: {i} </p>
    );
}

export function NoiseLevelReporter({currentFloor}: {currentFloor : Floor}) {
    return (
        <div>
            <div> <p>Report Noise Level of Floor</p> </div>
            <div>
                <NoiseLevelButton noiseNumber={1}/>
                <NoiseLevelButton noiseNumber={2}/>
                <NoiseLevelButton noiseNumber={3}/>
                <NoiseLevelButton noiseNumber={4}/>
                <NoiseLevelButton noiseNumber={5}/>
            </div>
            <div>
                <CalculateCurrentNoiseLevel cFloor={currentFloor}/>
            </div>
        </div>
    )
}