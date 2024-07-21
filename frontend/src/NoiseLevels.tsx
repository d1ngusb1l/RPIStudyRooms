import { useContext } from "react";
import { Floor, FloorsContext, NoiseReportDef, validateType } from "./types";
import { backendURL } from "./utils";

let reportedRecently = false;
let waitUntil = new Date();

function NoiseLevelButton({ noiseNumber, currentFloor }: { noiseNumber: number, currentFloor: string }) {
    const { floors, updateFloor } = useContext(FloorsContext);
    reportedRecently = true;
    waitUntil = new Date(Date.now() + 600000);
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
    let dummyDataPresent = false;
    for (const n of cFloor.noiseReports) {
        if(noiseVal == 0) dummyDataPresent = true;
        noiseVal += n.noiseLevel;
    }
    if(dummyDataPresent && cFloor.noiseReports.length > 1) { noiseVal /= (cFloor.noiseReports.length - 1)}
    else {noiseVal /= cFloor.noiseReports.length;}

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
    
    //preventing the user from flooding the database with reports
    if(reportedRecently) {
        return (
            <div>
                <p> You have reported to recently, please wait until {waitUntil.toLocaleTimeString()} to report again. </p>
                <CalculateCurrentNoiseLevel cFloor={floors[currentFloor]} />
            </div>
        )
    }

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