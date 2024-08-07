import { useContext, useEffect, useState } from "react";
import Collapsible from "./Collapsible";
import { Room, RoomContext, RoomDef, Rooms, RoomsDef, RoomStatusEnum, validateType } from "./types";
import { backendURL } from "./utils";
import { StatusCalculation, colorCalc, adjust, doorCalc } from "./StatusCalculation";


function StatusRadioInput({currentStatus, displayStatus, setCurrentStatus} : 
  {currentStatus : string, displayStatus : string, setCurrentStatus: (status : string) => unknown}) {

  //selecting the color
  let color = "";
  switch(displayStatus) {
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
  
  return(
    <div style={{backgroundColor : color, height : 40}}>
    
      <label>
        <input
            type="radio"
            checked={currentStatus == displayStatus}
            onChange={() => {setCurrentStatus(displayStatus);}}
        />
        {displayStatus}
      </label>
    </div>
  );
}

function SubmitStatusButton({rNum, currentStatus, setCurrentStatus} : 
  { rNum: string, currentStatus : string, setCurrentStatus: (status : string) => unknown }) {
  
  const { rooms, update } = useContext(RoomContext);

  switch(currentStatus) {
    case "Empty":
      return(
          <button 
          onClick={() => fetch(backendURL("/api/reportAsEmpty/" + rNum), { method: "POST" }).then(async (r) => {
          const data = await r.json();
          const newRoom = validateType(RoomDef, data);
          update({ ...rooms, [rNum]: newRoom });
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
          update({ ...rooms, [rNum]: newRoom });
          setCurrentStatus("");
        })}>
          Submit
        </button>
      );
      
    case "In Use by Me":
      return(<p>TO DO!!!!!!</p>);

    default:
      //for when user has nothing selected
      return(<div></div>);
  }
}

/*
function EmptyButton({ rNum }: { rNum: string }) {
  const { rooms, update } = useContext(RoomContext);

  return (
    <button 
      style={{backgroundColor: '#4CFF00'}}
      onClick={() => fetch(backendURL("/api/reportAsEmpty/" + rNum), { method: "POST" }).then(async (r) => {
      const data = await r.json();
      const newRoom = validateType(RoomDef, data);
      update({ ...rooms, [rNum]: newRoom });
    })}>
      Report as Empty
    </button>
  );
}

function FullButton({ rNum }: { rNum: string }) {
  const { rooms, update } = useContext(RoomContext);

  return (
    <button 
      style={{backgroundColor: '#FF0000'}}
      onClick={() => fetch(backendURL("/api/reportAsFull/" + rNum), { method: "POST" }).then(async (r) => {
      const data = await r.json();
      const newRoom = validateType(RoomDef, data);
      update({ ...rooms, [rNum]: newRoom });
    })}>
      Report as Full
    </button>
  );
}

const timeBetweenReminders = 1000 * 60 * 10; // 10 minutes (in ms)

function PersonalUseButton({ rNum }: { rNum: string }) {
  const { rooms, update } = useContext(RoomContext);
  const [reportedAt, setReportedAt] = useState(0);

  useEffect(() => {
    const current = Date.now();
    const timeRemaining = timeBetweenReminders - (current - reportedAt);
    if (timeRemaining > 0) {
      const timeout = setTimeout(() => alert("It's been 10 minutes, you should re-report yourself as in the room."), timeRemaining);
      return () => clearTimeout(timeout);
    }
  }, [reportedAt]);

  return (
    <button 
      style={{backgroundColor: '#FF0080'}}
      onClick={() => fetch(backendURL("/api/reportAsPersonalUse/" + rNum), { method: "POST" }).then(async (r) => {
      const data = await r.json();
      const newRoom = validateType(RoomDef, data);
      update({ ...rooms, [rNum]: newRoom });
      setReportedAt(Date.now());
    })}>
      Report as in Use by You
    </button>
  );
}
*/


function FormatRoom({ room, roomNumber, chance }: { room: Room, roomNumber: string, chance: string }) {

  const [currentStatus, setCurrentStatus] = useState("");

  return <Collapsible title={""}>
    <p>Reported as: {' ' + room.status + ' '}</p>
    <p>at: {new Date(room.lastReported).toLocaleTimeString()}</p>
    <p>Our Estimation: <text style={{color: adjust(colorCalc(chance),-53), fontWeight: "bold"}} >{chance}</text></p>

    <StatusRadioInput currentStatus={currentStatus} displayStatus="Empty" setCurrentStatus={setCurrentStatus}/>
    <StatusRadioInput currentStatus={currentStatus} displayStatus="Full" setCurrentStatus={setCurrentStatus}/>
    <StatusRadioInput currentStatus={currentStatus} displayStatus="In Use by Me" setCurrentStatus={setCurrentStatus}/>
    <SubmitStatusButton rNum={roomNumber} currentStatus={currentStatus} setCurrentStatus={setCurrentStatus}/>
  </Collapsible>
}

function FormatKey({roomNum, status}: {roomNum: string, status: string}) {
  const doorIcon = doorCalc(status);

  return(
    <div>
        <div className="room-header">
          <div id = "circle" style={{backgroundColor : colorCalc(status)}} ></div>  
          <img src={doorIcon} className='doorIcon' />
           <p style={{fontWeight: "bold"}}>{roomNum}</p>
        </div>
    </div>
  )
  
}

//the big boy function that actually does the thing
export default function ListRooms({rooms}: {rooms : Rooms}) {
  //react hook for updating rooms
  const [, setRooms] = useState<Rooms | null>(null);

  //grabbing our rooms from the backend
  /*
  useEffect(() => {
    fetch(backendURL("/api/database")).then(async (res) => {
      const data = await res.json();
      setRooms(validateType(RoomsDef, data));
    })
  }, []) */

  //ugly as heck but is a 3n solution to sorting this datastructure
  //so cope I guess, index 0 is room number, index 1 is the data, index 2 is the estimation of the room
  let certainlyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let likelyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let possiblyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let uncertainRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let possiblyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let likelyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let certainlyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let closedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];

  //iterating through our dictionary object and placing each room in the right container
  rooms ? Object.entries(rooms).forEach(room => {
    let status = StatusCalculation(room[1]);

    //creating a slightly larger version of the room datastructure to store the status of the room
    let modifiedRoom: [string, { status: RoomStatusEnum; lastReported: number; }, string]
      = [room[0], { status: room[1].status, lastReported: room[1].lastReported }, status];

    //checking the status and adding the room to the appropriate group
    if (status == "Certainly Occupied") { certainlyOccupiedRooms.push(modifiedRoom); }
    else if (status == "Likely Occupied") { likelyOccupiedRooms.push(modifiedRoom); }
    else if (status == "Possibly Occupied") { possiblyOccupiedRooms.push(modifiedRoom); }
    else if (status == "Possibly Empty") { possiblyEmptyRooms.push(modifiedRoom); }
    else if (status == "Likely Empty") { likelyEmptyRooms.push(modifiedRoom); }
    else if (status == "Certainly Empty") { certainlyEmptyRooms.push(modifiedRoom); }
    else if (status == "Closed/Reserved") { closedRooms.push(modifiedRoom); }
    else { uncertainRooms.push(modifiedRoom) }
  }) : 'error';

  //creating the array we will ultimately map our ui element onto
  let sortedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];

  //adding our rooms in order to our mappable array
  certainlyEmptyRooms.forEach(room => { sortedRooms.push(room); });
  likelyEmptyRooms.forEach(room => { sortedRooms.push(room); });
  possiblyEmptyRooms.forEach(room => { sortedRooms.push(room); });
  uncertainRooms.forEach(room => { sortedRooms.push(room); });
  possiblyOccupiedRooms.forEach(room => { sortedRooms.push(room); });
  likelyOccupiedRooms.forEach(room => { sortedRooms.push(room); });
  certainlyOccupiedRooms.forEach(room => { sortedRooms.push(room); });
  closedRooms.forEach(room => { sortedRooms.push(room); })

  //mapping our array to the ui element
  const listRooms = sortedRooms.map(([roomNumber, room, chance]) =>
    <div className="room-box">
      <li key={roomNumber} >
        <FormatKey roomNum={roomNumber} status={chance}/>
        <FormatRoom room={room} roomNumber={roomNumber} chance={chance} />
      </li>
    </div>
  )

  //returning our list of rooms
  return rooms !== null && <RoomContext.Provider value={{ rooms, update: setRooms }}><ul style={{ listStyle: 'none' }}>{listRooms}</ul></RoomContext.Provider>;
}