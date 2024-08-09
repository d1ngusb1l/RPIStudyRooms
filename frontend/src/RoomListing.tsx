import { useContext, useMemo, useState } from "react";
import Collapsible from "./Collapsible";
import { BuildingContext, Room, RoomDef, Rooms, validateType } from "./types";
import { backendURL } from "./utils";
import { StatusCalculation, colorCalc, adjust, doorCalc, RoomProbability } from "./StatusCalculation";

// Radio buttons for different report options
function StatusRadioInput({ currentStatus, displayStatus, setCurrentStatus }:
  { currentStatus: string, displayStatus: string, setCurrentStatus: (status: string) => unknown }) {

  //selecting the color based on display status
  let color = "";
  switch (displayStatus) {
    case "Empty":
      color = "#4CFF00";
      break;
    case "Full":
      color = "#FF0000";
      break;
    case "In Use by Me":
      color = "#FF0080";
      break;
    default:
      color = "#FFFFFF";
  }

  //returning the radio button with appropriate text and color
  return (
    <div style={{ backgroundColor: color, height: 40, fontWeight: "bold"}}>
      <label>
        <input
          type="radio"
          checked={currentStatus == displayStatus}
          onChange={() => { setCurrentStatus(displayStatus); }}
        />
        {displayStatus}
      </label>
    </div>
  );
}

// Button for submitting the currently selected noise
function SubmitStatusButton({ rNum, currentStatus, setCurrentStatus, duration }:
  { rNum: string, currentStatus: string, setCurrentStatus: (status: string) => unknown, duration: number }) {

  const { updateRoom, buildingKey } = useContext(BuildingContext);

  //using a switch case as we want to return fully different div elements depending on what user currently has selected
  switch (currentStatus) {
    case "Empty":
      return (
        <button
          onClick={() => fetch(backendURL(`/api/${buildingKey}/reportAsEmpty/${rNum}`), { method: "POST" }).then(async (r) => {
            //grabbing the room from the backend
            const data = await r.json();
            const newRoom = validateType(RoomDef, data);
            //updating the room to be empty
            updateRoom(rNum, newRoom);
            //resetting which button has been pressed
            setCurrentStatus("");
          })}>
          Submit
        </button>
      );

    case "Full":
      return (
        <button
          onClick={() => fetch(backendURL(`/api/${buildingKey}/reportAsFull/${rNum}`), { method: "POST" }).then(async (r) => {
            //grabbing the room from the backend
            const data = await r.json();
            const newRoom = validateType(RoomDef, data);
            //updating the room to be full
            updateRoom(rNum, newRoom);
            //resetting which button has been pressed
            setCurrentStatus("");
          })}>
          Submit
        </button>
      );

    case "In Use by Me":
      return (<button
        onClick={() => fetch(backendURL(`/api/${buildingKey}/reportAsPersonalUse/${rNum}/${duration}`), { method: "POST" }).then(async (r) => {
          //grabbing the room from the back end
          const data = await r.json();
          const newRoom = validateType(RoomDef, data);
          //updating the room to be in personal use
          updateRoom(rNum, newRoom);
            //resetting which button has been pressed
          setCurrentStatus("");
        })}>
        Submit
      </button>);

    default:
      //for when user has nothing selected
      return (<div></div>);
  }
}

// Finds the correct room information to display for list
function FormatRoom({ room, roomNumber, chance, tags }: { room: Room, roomNumber: string, chance: RoomProbability, tags: Array<String>}) {

  //react hook for determining which submit button to display
  const [currentStatus, setCurrentStatus] = useState("");

  //react hook for determining how long user wants to use the room
  const [duration, setDuration] = useState(1);

  //collapsible menu for a single room in the list with all the different repor toptions
  return <Collapsible title={""}>
    <p>Reported as: {' ' + room.status + ' '}</p>
    {room.lastReported > 0 && <p>at: {new Date(room.lastReported).toLocaleTimeString()}</p>}
    {room.claimedUntil !== undefined && <p>Claimed until: {new Date(room.claimedUntil).toLocaleTimeString()}</p>}
    <p>Our Estimation: <text style={{ color: adjust(colorCalc(chance), -53), fontWeight: "bold" }} >{chance}</text></p>

    <StatusRadioInput currentStatus={currentStatus} displayStatus="Empty" setCurrentStatus={setCurrentStatus} />
    <StatusRadioInput currentStatus={currentStatus} displayStatus="Full" setCurrentStatus={setCurrentStatus} />
    <StatusRadioInput currentStatus={currentStatus} displayStatus="In Use by Me" setCurrentStatus={setCurrentStatus} />{currentStatus === "In Use by Me" && <label><input type="number" placeholder="Duration in minutes" min="1" max="120" value={duration} onChange={(e) => setDuration(Number(e.target.value))} /> Reservation Time (minutes)</label>}
    {currentStatus && <SubmitStatusButton rNum={roomNumber} currentStatus={currentStatus} setCurrentStatus={setCurrentStatus} duration={duration} />}
  </Collapsible>
}
// <p>Tags: {tags.join(', ')}</p>

//Find the correct colors and symbols to display for list
//eseentially displays the header of each collapsible menu in the list
function FormatKey({ roomNum, status }: { roomNum: string, status: string }) {
  const doorIcon = doorCalc(status);

  return (
    <div>
      <div className="room-header">
        <div id="circle" style={{ backgroundColor: colorCalc(status) }} ></div>
        <img src={doorIcon} className='doorIcon' />
        <p style={{ fontWeight: "bold" }}>{roomNum}</p>
      </div>
    </div>
  )

}

export interface RoomEstimation {
  roomNumber: string;
  room: Room;
  estimation: RoomProbability;
}


//the big boy function that actually lists out the rooms
export default function ListRooms({filters} : {filters : Array<String>} ) {

  //grabbing the list of rooms from the building context
  const { rooms } = useContext(BuildingContext);

  //verifying every room passed to us is valid
  const newRooms : Rooms = Object.entries(rooms).reduce((acc, [key, value]) => {
    if (filters.length === 0 || (value.tags && filters.every(filter => value.tags.includes(filter)))) {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  //function which we call in our react component
  const listRooms = useMemo(() => {

    //list of all possible statuses for a room
    const roomProbabilityItems: Record<RoomProbability, RoomEstimation[]> = {
      "Certainly Empty": [],
      "Likely Empty": [],
      "Possibly Empty": [],
      "Uncertain": [],
      "Possibly Occupied": [],
      "Likely Occupied": [],
      "Certainly Occupied": [],
      "Closed": [],
      "Available": [],
      "Reserved": [],
    }

    //iterating through our dictionary object and placing each room in the right container
    newRooms ? Object.entries(newRooms).forEach(room => {
      const status = StatusCalculation(room[1]);

      //creating a slightly larger version of the room datastructure to store the status of the room
      const modifiedRoom: RoomEstimation = { roomNumber: room[0], room: room[1], estimation: status};
      roomProbabilityItems[status].push(modifiedRoom);

    }) : 'error';

    //creating the array we will ultimately map our ui element onto
    const sortedRooms: RoomEstimation[] = [];

    //adding our rooms in order to our mappable array
    const probabilityOrder: RoomProbability[] = [
      RoomProbability.Available,
      RoomProbability.CertainlyEmpty,
      RoomProbability.LikelyEmpty,
      RoomProbability.PossiblyEmpty,
      RoomProbability.Uncertain,
      RoomProbability.PossiblyOccupied,
      RoomProbability.LikelyOccupied,
      RoomProbability.CertainlyOccupied,
      RoomProbability.Reserved,
      RoomProbability.Closed,
    ];

    //adding the rooms in order
    probabilityOrder.forEach(probability => {
      sortedRooms.push(...roomProbabilityItems[probability]);
    });

    //mapping our array to the ui element
    return sortedRooms.map(({ roomNumber, room, estimation: chance}) =>
      <div className="room-box">
        <li key={roomNumber} >
          <FormatKey roomNum={roomNumber} status={chance} />
          <FormatRoom room={room} roomNumber={roomNumber} chance={chance}/>
        </li>
      </div>
    )
  }, [rooms])

  //returning our list of rooms
  return rooms !== null && <ul style={{ listStyle: 'none' }}>{listRooms}</ul>;
}