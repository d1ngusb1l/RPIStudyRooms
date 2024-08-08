import { useContext, useEffect, useMemo, useState } from "react";
import { BuildingContext, Floor, NoiseReportDef, validateType } from "./types";
import { backendURL } from "./utils";



//radio button alternative to 
//regular buttons from before
/* Circle select buttons for different noice levels */
function NoiseLevelRadioInput({ noiseNumber, selectedNoiseLevel, setSelectedNoiseLevel }:
    { noiseNumber: number, selectedNoiseLevel: number, setSelectedNoiseLevel: (noiseLevel: number) => unknown }) {

    let noiseText = "";

    switch (noiseNumber) {
        case 1:
            noiseText = "Very Quiet";
            break;
        case 2:
            noiseText = "Quiet";
            break;
        case 3:
            noiseText = "Moderate";
            break;
        case 4:
            noiseText = "Loud";
            break;
        case 5:
            noiseText = "Very Loud";
            break;
        default:
            noiseText = "error"
    }

    return (
        <label>
            <input
                type="radio"
                checked={selectedNoiseLevel == noiseNumber}
                onChange={() => { setSelectedNoiseLevel(noiseNumber); }}
            />
            {noiseText}
        </label>
    );
}

//button for submitting the currently selected noise
function SubmitButton({ noiseNumber, setLastReported }: { noiseNumber: number, setLastReported: (time: number) => unknown }) {
    const { updateFloor, currentFloorKey, currentFloor, buildingKey } = useContext(BuildingContext);
    return (
        <button onClick={() => fetch(backendURL(`/api/${buildingKey}/addNoiseReport/${currentFloorKey}/${noiseNumber}`), { method: "POST" }).then(async (r) => {
            const data = await r.json();
            const newNoiseReport = validateType(NoiseReportDef, data);
            const newFloor: Floor = { ...currentFloor, noiseReports: [...currentFloor.noiseReports, newNoiseReport] };
            updateFloor(currentFloorKey, newFloor);
            setLastReported(Date.now());
        })}>
            Submit
        </button>
    );
}


//component which says current noise level of floor
function CalculateCurrentNoiseLevel() {
    const { currentFloorKey, building } = useContext(BuildingContext);
    const cFloor = building.floors[currentFloorKey];
    let noiseVal = 0;
    let dummyDataPresent = false;
    for (const n of cFloor.noiseReports) {
        if (noiseVal == 0) dummyDataPresent = true;
        noiseVal += n.noiseLevel;
    }
    if (dummyDataPresent && cFloor.noiseReports.length > 1) { noiseVal /= (cFloor.noiseReports.length - 1) }
    else if (cFloor.noiseReports.length == 0) { noiseVal = 0; }
    else { noiseVal /= cFloor.noiseReports.length; }

    let noiseLevel = "";
    if (noiseVal == 0) { noiseLevel = "Unknown"; }
    else if (noiseVal < 1.5) { noiseLevel = "Very Quiet"; }
    else if (noiseVal < 2.5) { noiseLevel = "Quiet"; }
    else if (noiseVal < 3.5) { noiseLevel = "Moderate"; }
    else if (noiseVal < 4.5) { noiseLevel = "Loud"; }
    else { noiseLevel = "Very Loud" }

    return (
        <p style={{ margin: '1px auto' }}> Current noise level: <text style={{ fontWeight: 'bold' }}>{noiseLevel} </text> </p>
    );
}


//constant for the cooldown between nosie reports
const timeBetweenNoiseReports = 1000 * 60 * 10; // 10 minutes


//the main react component from this function
export function NoiseLevelReporter() {

    //react hooks for keeping track of when the last report was made
    const [lastReported, setLastReported] = useState(0);
    const [, setCounter] = useState(0);


    //it makes last reported work
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


    //timers for determining when the last report was made
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


    //react hook for keeping track of the currently reported noise level
    const [selectedNoiseLevel, setSelectedNoiseLevel] = useState(3);

    return (

        <div>
            {reportedRecently ? (
                <p> You have reported too recently, please wait until {waitUntil.toLocaleTimeString()} to report again. </p>
            ) : <><div><p style={{ margin: '1px auto', fontWeight: 'bold' }}>Report Noise Level of Floor</p></div>
                <div>
                    <NoiseLevelRadioInput noiseNumber={1} selectedNoiseLevel={selectedNoiseLevel} setSelectedNoiseLevel={setSelectedNoiseLevel} />
                    <NoiseLevelRadioInput noiseNumber={2} selectedNoiseLevel={selectedNoiseLevel} setSelectedNoiseLevel={setSelectedNoiseLevel} />
                    <NoiseLevelRadioInput noiseNumber={3} selectedNoiseLevel={selectedNoiseLevel} setSelectedNoiseLevel={setSelectedNoiseLevel} />
                    <NoiseLevelRadioInput noiseNumber={4} selectedNoiseLevel={selectedNoiseLevel} setSelectedNoiseLevel={setSelectedNoiseLevel} />
                    <NoiseLevelRadioInput noiseNumber={5} selectedNoiseLevel={selectedNoiseLevel} setSelectedNoiseLevel={setSelectedNoiseLevel} />
                    <SubmitButton noiseNumber={selectedNoiseLevel} setLastReported={setLastReported} />
                </div>
            </>}

            <div>
                <CalculateCurrentNoiseLevel />
            </div>
        </div>
    )
}