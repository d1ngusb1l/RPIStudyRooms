import { useContext, useMemo, useState } from "react";
import Collapsible from "./Collapsible";
import { BuildingContext, Room, RoomDef, validateType } from "./types";
import { backendURL } from "./utils";
import { StatusCalculation, colorCalc, adjust, doorCalc, RoomProbability } from "./StatusCalculation";


function StatusRadioInput({ currentStatus, displayStatus, setCurrentStatus }:
  { currentStatus: string, displayStatus: string, setCurrentStatus: (status: string) => unknown }) {

  //selecting the color
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

  return (
    <div style={{ backgroundColor: color, height: 40 }}>
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

function SubmitStatusButton({ rNum, currentStatus, setCurrentStatus, duration }:
  { rNum: string, currentStatus: string, setCurrentStatus: (status: string) => unknown, duration: number }) {

  const { updateRoom } = useContext(BuildingContext);

  switch (currentStatus) {
    case "Empty":
      return (
        <button
          onClick={() => fetch(backendURL("/api/reportAsEmpty/" + rNum), { method: "POST" }).then(async (r) => {
            const data = await r.json();
            const newRoom = validateType(RoomDef, data);
            updateRoom(rNum, newRoom);
            setCurrentStatus("");
          })}>
          Submit
        </button>
      );

    case "Full":
      return (
        <button
          onClick={() => fetch(backendURL("/api/reportAsFull/" + rNum), { method: "POST" }).then(async (r) => {
            const data = await r.json();
            const newRoom = validateType(RoomDef, data);
            updateRoom(rNum, newRoom);
            setCurrentStatus("");
          })}>
          Submit
        </button>
      );

    case "In Use by Me":
      return (<button
        onClick={() => fetch(backendURL(`/api/reportAsPersonalUse/${rNum}/${duration}`), { method: "POST" }).then(async (r) => {
          const data = await r.json();
          const newRoom = validateType(RoomDef, data);
          updateRoom(rNum, newRoom);
          setCurrentStatus("");
        })}>
        Submit
      </button>);

    default:
      //for when user has nothing selected
      return (<div></div>);
  }
}

function FormatRoom({ room, roomNumber, chance }: { room: Room, roomNumber: string, chance: RoomProbability }) {

  const [currentStatus, setCurrentStatus] = useState("");
  const [duration, setDuration] = useState(1);

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

//ugly as heck but is a 3n solution to sorting this datastructure
//so cope I guess, index 0 is room number, index 1 is the data, index 2 is the estimation of the room
export interface RoomEstimation {
  roomNumber: string;
  room: Room;
  estimation: RoomProbability;
}


//the big boy function that actually does the thing
export default function ListRooms() {
  const { rooms } = useContext(BuildingContext);

  const listRooms = useMemo(() => {

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
    rooms ? Object.entries(rooms).forEach(room => {
      const status = StatusCalculation(room[1]);

      //creating a slightly larger version of the room datastructure to store the status of the room
      const modifiedRoom: RoomEstimation = { roomNumber: room[0], room: room[1], estimation: status };
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

    probabilityOrder.forEach(probability => {
      sortedRooms.push(...roomProbabilityItems[probability]);
    });

    //mapping our array to the ui element
    return sortedRooms.map(({ roomNumber, room, estimation: chance }) =>
      <div className="room-box">
        <li key={roomNumber} >
          <FormatKey roomNum={roomNumber} status={chance} />
          <FormatRoom room={room} roomNumber={roomNumber} chance={chance} />
        </li>
      </div>
    )
  }, [rooms])

  //returning our list of rooms
  return rooms !== null && <ul style={{ listStyle: 'none' }}>{listRooms}</ul>;
}