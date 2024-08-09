import { useContext, useEffect, useMemo, useState } from "react";
import { BuildingContext, Floor, NoiseReportDef, validateType } from "./types";
import { backendURL } from "./utils";



//radio buttons for reporting noise level
function NoiseLevelRadioInput({ noiseNumber, selectedNoiseLevel, setSelectedNoiseLevel }:
    { noiseNumber: number, selectedNoiseLevel: number, setSelectedNoiseLevel: (noiseLevel: number) => unknown }) {

    //text to be displayed next to the button
    let noiseText = "";

    //switch case for determining what the text should be
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

    //html stuff
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
    
    //react hook for addding noise reports to a floor 
    const { updateFloor, currentFloorKey, currentFloor, buildingKey } = useContext(BuildingContext);
    
    return (
        <button onClick={() => fetch(backendURL(`/api/${buildingKey}/addNoiseReport/${currentFloorKey}/${noiseNumber}`), { method: "POST" }).then(async (r) => {
            //getting list of noise reports from back end
            const data = await r.json();
            const newNoiseReport = validateType(NoiseReportDef, data);
            const newFloor: Floor = { ...currentFloor, noiseReports: [...currentFloor.noiseReports, newNoiseReport] };
            //updating our list of noise reports with new information
            updateFloor(currentFloorKey, newFloor);
            setLastReported(Date.now());
        })}>
            Submit
        </button>
    );
}

//component which displays current noise level of floor
function CalculateCurrentNoiseLevel() {

    //grabbing our current floors from current building from context provider
    const { currentFloorKey, building } = useContext(BuildingContext);

    //the current floor that we need to calculate the noise level of
    const cFloor = building.floors[currentFloorKey];
    
    //variable for tracking the average value of all noise reports
    let noiseVal = 0;

    //variable for checking if the false noise report that starts
    //in the system for type verification purposes exists
    let dummyDataPresent = false;
    
    //iteratong through each noise report in our current floor
    for (const n of cFloor.noiseReports) {
        //checking for our false noise report
        if (noiseVal == 0) dummyDataPresent = true;

        //adding current noise level to our tracking average
        noiseVal += n.noiseLevel;
    }
    //finding average with dummy data present, substracting one from number of reports
    if (dummyDataPresent && cFloor.noiseReports.length > 1) { noiseVal /= (cFloor.noiseReports.length - 1) }
    //checking for case where no noise level reports have been made in the past hour
    else if (cFloor.noiseReports.length == 0) { noiseVal = 0; }
    //normal calculations of average
    else { noiseVal /= cFloor.noiseReports.length; }

    //turning our number into text to be displayed
    let noiseLevel = "";

    //the actual if else statements for calculating this
    if (noiseVal == 0) { noiseLevel = "Unknown"; }
    else if (noiseVal < 1.5) { noiseLevel = "Very Quiet"; }
    else if (noiseVal < 2.5) { noiseLevel = "Quiet"; }
    else if (noiseVal < 3.5) { noiseLevel = "Moderate"; }
    else if (noiseVal < 4.5) { noiseLevel = "Loud"; }
    else { noiseLevel = "Very Loud" }

    //the actual html element
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

    //creating a cookie to keep track of when the user last made a noise report
    useEffect(() => {
        const localStorageLastReported = localStorage.getItem("lastReported");
        if (localStorageLastReported) {
            setLastReported(parseInt(localStorageLastReported));
        }
    }, []);

    //setting the value of the cookie for when user makes a report
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

    //timers for determining how recently the last report was made
    const current = Date.now();
    const reportedRecently = current - lastReported < (timeBetweenNoiseReports);
    const waitUntil = useMemo(() => new Date(lastReported + (timeBetweenNoiseReports)), [lastReported]);

    //checking how recently the report was made and seeing if we can allow the user to report again
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

    //the react component which gets returned
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