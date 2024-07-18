import { useContext } from "react";
import { Floor, FloorsContext, NoiseReportDef, validateType } from "./types";
import { backendURL } from "./utils";

function NoiseLevelButton({ noiseNumber, currentFloor }: { noiseNumber: number, currentFloor: string }) {
    const { floors, updateFloor } = useContext(FloorsContext);
    return (
        <button onClick={() => fetch(backendURL(`/api/addNoiseReport/${currentFloor}/${noiseNumber}`), { method: "POST" }).then(async (r) => {
            const data = await r.json();
            const newNoiseReport = validateType(NoiseReportDef, data);
            const newFloor: Floor = { ...floors[currentFloor], noiseReports: [...floors[currentFloor].noiseReports, newNoiseReport] };
            updateFloor(currentFloor, newFloor);
        })}>
            {noiseNumber}
        </button>
    );
}

function CalculateCurrentNoiseLevel({ cFloor }: { cFloor: Floor }) {
    let noiseVal = 0;
    for (const n of cFloor.noiseReports) {
        noiseVal += n.noiseLevel;
    }
    noiseVal /= cFloor.noiseReports.length;

    let noiseLevel = "";
    if(noiseVal == 0) {noiseLevel = "Unknown";}
    else if(noiseVal <= 1.4) {noiseLevel = "Very Quiet";}
    else if(noiseVal <= 2.4) {noiseLevel = "Quiet";}
    else if(noiseVal <= 3.4) {noiseLevel = "Moderate";}
    else if(noiseVal <= 4.4) {noiseLevel = "Loud";}
    else {noiseLevel = "Very Loud"}

    return (
        <p> Current noise level: {noiseLevel} </p>
    );
}

export function NoiseLevelReporter({ currentFloor }: { currentFloor: string }) {
    const { floors } = useContext(FloorsContext);
    return (
        <div>
            <div><p>Report Noise Level of Floor</p></div>
            <div>
                <NoiseLevelButton noiseNumber={1} currentFloor={currentFloor} />
                <NoiseLevelButton noiseNumber={2} currentFloor={currentFloor} />
                <NoiseLevelButton noiseNumber={3} currentFloor={currentFloor} />
                <NoiseLevelButton noiseNumber={4} currentFloor={currentFloor} />
                <NoiseLevelButton noiseNumber={5} currentFloor={currentFloor} />
            </div>
            <div>
                <CalculateCurrentNoiseLevel cFloor={floors[currentFloor]} />
            </div>
        </div>
    )
}