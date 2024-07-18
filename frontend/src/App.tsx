//import { useEffect, useState } from 'react';
import React, { createContext, useCallback, useContext, useReducer, useState } from 'react';
import './App.css'
import Collapsible from "./Collapsible";
//import { Type, type Static } from '@sinclair/typebox'
//import { Value } from '@sinclair/typebox/value'
//import { backendURL } from './utils';

/*
const RoomDef = Type.Object({
  id: Type.Number(),
  roomNumber: Type.Number(),
  reportAsOccupied: Type.Boolean(),
  timeOfReport: Type.Date()
})
type Room = Static<typeof RoomDef>
const RoomArrayDef = Type.Array(RoomDef)
*/

interface Room {
  number: string;
  status: "empty" | "full";
  lastReported: Date;
}

type RoomUpdateAction = { type: "single", number: string, newData: Partial<Omit<Room, "number" | "lastReported">> } | { type: "all", data: Room[] };


const initialRooms = [
  { number: "323-A", status: "empty", lastReported: new Date() },
  { number: "332-A", status: "empty", lastReported: new Date() },
  { number: "332-B", status: "empty", lastReported: new Date() },
  { number: "332-C", status: "empty", lastReported: new Date() },
  { number: "332-D", status: "empty", lastReported: new Date() },
  { number: "332-E", status: "empty", lastReported: new Date() },
  { number: "337-A", status: "empty", lastReported: new Date() },
  { number: "337-B", status: "empty", lastReported: new Date() },
  { number: "337-C", status: "empty", lastReported: new Date() },
  { number: "337-D", status: "empty", lastReported: new Date() },
  { number: "337-E", status: "empty", lastReported: new Date() },
  { number: "332-A", status: "empty", lastReported: new Date() },
  { number: "342-B", status: "empty", lastReported: new Date() },
  { number: "342-C", status: "empty", lastReported: new Date() },
  { number: "352-A", status: "empty", lastReported: new Date() },
  { number: "352-B", status: "empty", lastReported: new Date() },
  { number: "352-C", status: "empty", lastReported: new Date() },
  { number: "352-D", status: "empty", lastReported: new Date() },
  { number: "352-E", status: "empty", lastReported: new Date() },
  { number: "423-A", status: "empty", lastReported: new Date() },
  { number: "423-B", status: "empty", lastReported: new Date() },
  { number: "423-C", status: "empty", lastReported: new Date() },
  { number: "423-D", status: "empty", lastReported: new Date() },
  { number: "423-E", status: "empty", lastReported: new Date() },
  { number: "424-A", status: "empty", lastReported: new Date() },
  { number: "424-B", status: "empty", lastReported: new Date() },
  { number: "433-A", status: "empty", lastReported: new Date() },
  { number: "435-D", status: "empty", lastReported: new Date() },
  { number: "437-A", status: "empty", lastReported: new Date() },
  { number: "437-B", status: "empty", lastReported: new Date() },
  { number: "437-C", status: "empty", lastReported: new Date() },
  { number: "423-A", status: "empty", lastReported: new Date() },
  { number: "423-B", status: "empty", lastReported: new Date() },
  { number: "423-C", status: "empty", lastReported: new Date() },
  { number: "442-A", status: "empty", lastReported: new Date() },
  { number: "442-B", status: "empty", lastReported: new Date() },
  { number: "442-C", status: "empty", lastReported: new Date() },
  { number: "442-D", status: "empty", lastReported: new Date() },
  { number: "442-E", status: "empty", lastReported: new Date() },
  { number: "453-A", status: "empty", lastReported: new Date() },
  { number: "453-B", status: "empty", lastReported: new Date() },
  { number: "453-C", status: "empty", lastReported: new Date() },
  { number: "453-D", status: "empty", lastReported: new Date() },
  { number: "453-E", status: "empty", lastReported: new Date() },
] as const;

const RoomContext = createContext<{ rooms: Room[], update: (action: RoomUpdateAction) => unknown }>({ rooms: [], update: () => undefined });

function EmptyButton({ rNum }: { rNum: string }) {

  const { update } = useContext(RoomContext);

  return (
    <button onClick={() => update({ type: "single", number: rNum, newData: { status: "empty" } })}>
      Report as Empty
    </button>
  );
}


function FullButton({ rNum }: { rNum: string }) {

  const { update } = useContext(RoomContext);

  return (
    <button onClick={() => update({ type: "single", number: rNum, newData: { status: "full" } })}>
      Report as Full
    </button>
  );
}

function ListRooms() {

  const { rooms } = useContext(RoomContext);

  /*
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    fetch(backendURL("/api/database")).then(async (res) => {
      const data = await res.json();
      if (Value.Check(RoomArrayDef, data)) {
        // We know for sure that data is of type Room[]
        setRooms(data);
      } else {
        throw new Error("Invalid data");
      }
    })
  }, [])

  const listRooms = rooms ? rooms.map(room =>
    <li key={room.roomNumber}>
      <Collapsible title={room.roomNumber.toString()}>
        <p>
          Reported as: {' ' + room.reportAsOccupied + ' '}
          at: {room.timeOfReport.toDateString()}
        </p>
        <FullButton rNum={room.roomNumber}/>
        <EmptyButton/>
      </Collapsible>
    </li>
  ) : 'error';*/

  //const [roomNum, updateRoomNum] = useState(100);

  //updateRoomNum(101);

  const listRooms = rooms.map(room =>
    <li key={room.number}>
      <Collapsible title={room.number}>
        <p>
          Reported as: {' ' + room.status + ' '}
          at: {room.lastReported.toLocaleTimeString()}
        </p>
        <FullButton rNum={room.number} />
        <EmptyButton rNum={room.number} />
      </Collapsible>
    </li>
  );
  return <ul style={{ listStyle: 'none' }}>{listRooms}</ul>;
}


function ScrollableList() {
  return (
    <div style={{ height: '400px', overflow: 'scroll', overflowX: "hidden" }}>
      <ListRooms />
    </div>
  );
}

export default function MyApp() {
  //const [val, updateState] = useState(0);
  // const [rooms, updateRooms] = useState<Room[]>([...initialRooms)
  const [rooms, updateRooms] = useReducer((state: Room[], action: RoomUpdateAction) => {
    switch (action.type) {
      case "single": {
        const roomIndex = state.findIndex((room) => room.number === action.number);
        if (roomIndex === -1) throw new Error("invalid room number");
        const newRoom: Room = { ...state[roomIndex], ...action.newData, lastReported: new Date() };
        const copy = [...state];
        copy[roomIndex] = newRoom;
        return copy;
      }
      case "all": {
        return action.data;
      }
    }
  }, [...initialRooms]);
  return (
    <RoomContext.Provider value={{ rooms, update: updateRooms }}>
      <h1>List of Rooms</h1>
      <ScrollableList />
    </RoomContext.Provider>
  );
}

