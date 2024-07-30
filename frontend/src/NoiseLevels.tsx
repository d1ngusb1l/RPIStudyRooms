import { useContext, useEffect, useMemo, useState } from "react";
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
    else if(cFloor.noiseReports.length == 0) {noiseVal = 0;}
    else { noiseVal /= cFloor.noiseReports.length; }

    let noiseLevel = "";
    if (noiseVal == 0) { noiseLevel = "Unknown"; }
    else if (noiseVal < 1.5) { noiseLevel = "Very Quiet"; }
    else if (noiseVal < 2.5) { noiseLevel = "Quiet"; }
    else if (noiseVal < 3.5) { noiseLevel = "Moderate"; }
    else if (noiseVal < 4.5) { noiseLevel = "Loud"; }
    else { noiseLevel = "Very Loud" }

    return (
        <p style={{ margin: '1px auto' }}> Current noise level: <text style={{ fontWeight: 'bold' }}>{noiseLevel}</text> </p>
    );
}

const timeBetweenNoiseReports = 1000 * 60 * 10; // 10 minutes

export function NoiseLevelReporter({ currentFloor }: { currentFloor: string }) {
    const { floors } = useContext(FloorsContext);
    const [lastReported, setLastReported] = useState(0);
    const [, setCounter] = useState(0);

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
    const reportedRecently = current - lastReported < (timeBetweenNoiseReports);
    const waitUntil = useMemo(() => new Date(lastReported + (timeBetweenNoiseReports)), [lastReported]);

    useEffect(() => {
        if (reportedRecently) {
            const timeout = setTimeout(() => {
                setCounter((c) => c + 1);
            }, waitUntil.getTime() - current);
            return () => {
                clearTimeout(timeout);
            }
        }
    }, [reportedRecently, waitUntil, current]);


    return (
        <div>
            {reportedRecently ? (
                <p> You have reported too recently, please wait until {waitUntil.toLocaleTimeString()} to report again. </p>
            ) : <><div><p style={{ margin: '1px auto' }}>Report Noise Level of Floor</p></div>
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