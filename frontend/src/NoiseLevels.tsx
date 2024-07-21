import { useContext, useEffect, useState } from "react";
import { Floor, FloorsContext, NoiseReportDef, validateType } from "./types";
import { backendURL } from "./utils";


function NoiseLevelButton({ noiseNumber, currentFloor, setLastReported }: { noiseNumber: number, currentFloor: string, setLastReported: (time: number) => unknown }) {
    const { floors, updateFloor } = useContext(FloorsContext);
    return (
        <button onClick={() => fetch(backendURL(`/api/addNoiseReport/${currentFloor}/${noiseNumber}`), { method: "POST" }).then(async (r) => {
            const data = await r.json();
            const newNoiseReport = validateType(NoiseReportDef, data);
            const newFloor: Floor = { ...floors[currentFloor], noiseReports: [...floors[currentFloor].noiseReports, newNoiseReport] };
            updateFloor(currentFloor, newFloor);
            setLastReported(Date.now());
        })}>
            {noiseNumber}
        </button>
    );
}

function CalculateCurrentNoiseLevel({ cFloor }: { cFloor: Floor }) {
    let noiseVal = 0;
    let dummyDataPresent = false;
    for (const n of cFloor.noiseReports) {
        if (noiseVal == 0) dummyDataPresent = true;
        noiseVal += n.noiseLevel;
    }
    if (dummyDataPresent && cFloor.noiseReports.length > 1) { noiseVal /= (cFloor.noiseReports.length - 1) }
    else { noiseVal /= cFloor.noiseReports.length; }

    let noiseLevel = "";
    if (noiseVal == 0) { noiseLevel = "Unknown"; }
    else if (noiseVal <= 1.4) { noiseLevel = "Very Quiet"; }
    else if (noiseVal <= 2.4) { noiseLevel = "Quiet"; }
    else if (noiseVal <= 3.4) { noiseLevel = "Moderate"; }
    else if (noiseVal <= 4.4) { noiseLevel = "Loud"; }
    else { noiseLevel = "Very Loud" }

    return (
        <p> Current noise level: {noiseLevel} </p>
    );
}

export function NoiseLevelReporter({ currentFloor }: { currentFloor: string }) {
    const { floors } = useContext(FloorsContext);
    const [lastReported, setLastReported] = useState(0);

    useEffect(() => {
        const localStorageLastReported = localStorage.getItem("lastReported");
        if (localStorageLastReported) {
            setLastReported(parseInt(localStorageLastReported));
        }
    }, []);

    useEffect(() => {
        const localStorageLastReported = localStorage.getItem("lastReported");
        if (localStorageLastReported) {
            const lastTime = parseInt(localStorageLastReported);
            if (lastReported > lastTime) {
                localStorage.setItem("lastReported", lastReported.toString());
            }
        } else {
            localStorage.setItem("lastReported", lastReported.toString());
        }
    }, [lastReported]);

    const current = Date.now();
    const reportedRecently = current - lastReported < (1000 * 60 * 10); // 10 minutes
    const waitUntil = new Date(lastReported + (1000 * 60 * 10));

    return (
        <div>
            {reportedRecently ? (
                <p> You have reported too recently, please wait until {waitUntil.toLocaleTimeString()} to report again. </p>
            ) : <><div><p>Report Noise Level of Floor</p></div>
                <div>
                    <NoiseLevelButton noiseNumber={1} currentFloor={currentFloor} setLastReported={setLastReported} />
                    <NoiseLevelButton noiseNumber={2} currentFloor={currentFloor} setLastReported={setLastReported} />
                    <NoiseLevelButton noiseNumber={3} currentFloor={currentFloor} setLastReported={setLastReported} />
                    <NoiseLevelButton noiseNumber={4} currentFloor={currentFloor} setLastReported={setLastReported} />
                    <NoiseLevelButton noiseNumber={5} currentFloor={currentFloor} setLastReported={setLastReported} />
                </div>
            </>}
            <div>
                <CalculateCurrentNoiseLevel cFloor={floors[currentFloor]} />
            </div>
        </div>
    )
}