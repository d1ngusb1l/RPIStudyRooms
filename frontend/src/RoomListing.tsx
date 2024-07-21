import { useContext, useEffect, useState } from "react";
import Collapsible from "./Collapsible";
import { Room, RoomContext, RoomDef, Rooms, RoomsDef, RoomStatusEnum, validateType } from "./types";
import { backendURL } from "./utils";
import { StatusCalculation, colorCalc } from "./StatusCalculation";

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


function FormatRoom({ room, roomNumber, chance }: { room: Room, roomNumber: string, chance: string }) {
  return <Collapsible>
    <p>Reported as: {' ' + room.status + ' '}</p>
    <p>at: {new Date(room.lastReported).toLocaleTimeString()}</p>
    <p>Our Estimation: {chance}</p>
    <FullButton rNum={roomNumber} />
    <EmptyButton rNum={roomNumber} />
    <PersonalUseButton rNum={roomNumber} />
  </Collapsible>
}

function FormatKey({roomNum, status}: {roomNum: string, status: string}) {
  
  if(status == "Certainly Occupied") {
    return(
      <div>
        <p>{roomNum}</p>
        <div id = "coCircle"></div>
      </div>
    )
  }

  if(status == "Likely Occupied") {
    return(
      <div>
        <p>{roomNum}</p>
        <div id = "loCircle"></div>
      </div>
    )
  }

  if(status == "Possibly Occupied") {
    return(
      <div>
        <p>{roomNum}</p>
        <div id = "poCircle"></div>
      </div>
    )
  }

  if(status == "Uncertain") {
    return(
      <div>
        <p>{roomNum}</p>
        <div id = "uCircle"></div>
      </div>
    )
  }

  if(status == "Possibly Empty") {
    return(
      <div>
        <p>{roomNum}</p>
        <div id = "peCircle"></div>
      </div>
    )
  }

  if(status == "Likely Empty") {
    return(
      <div>
        <p>{roomNum}</p>
        <div id = "leCircle"></div>
      </div>
    )
  }

  if(status == "Certainly Empty") {
    return(
      <div>
        <p>{roomNum}</p>
        <div id = "ceCircle"></div>
      </div>
    )
  }

  return(
    <p>{roomNum}</p>
  )

}

//the big boy function that actually does the thing
export default function ListRooms() {
  //grabbing our room object from the back end
  const [rooms, setRooms] = useState<Rooms | null>(null);

  useEffect(() => {
    fetch(backendURL("/api/database")).then(async (res) => {
      const data = await res.json();
      setRooms(validateType(RoomsDef, data));
    })
  }, [])


  //ugly as heck but is a 3n solution to sorting this datastructure
  //so cope I guess, index 0 is room number, index 1 is the data, index 2 is the estimation of the room
  let certainlyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let likelyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let possiblyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let uncertainRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let possiblyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let likelyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let certainlyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];

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

  //mapping our array to the ui element
  const listRooms = sortedRooms.map(([roomNumber, room, chance]) =>
    <li key={roomNumber} >
      <FormatKey roomNum={roomNumber} status={chance}/>
      <FormatRoom room={room} roomNumber={roomNumber} chance={chance} />
    </li>
  )

  //returning our list of rooms
  return rooms !== null && <RoomContext.Provider value={{ rooms, update: setRooms }}><ul style={{ listStyle: 'none' }}>{listRooms}</ul></RoomContext.Provider>;
}