import { useEffect, useState } from 'react';
import './App.css'
import Collapsible from "./Collapsible";
import { Type, type Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { backendURL } from './utils';

const RoomDef = Type.Object({
  id: Type.Number(),
  roomNumber: Type.Number(),
  reportAsOccupied: Type.Boolean(),
  timeOfReport: Type.Date()
})
type Room = Static<typeof RoomDef>
const RoomArrayDef = Type.Array(RoomDef)


function EmptyButton() {
  return (
    <button>
      Report as Empty
    </button>
  );
}

function FullButton() {
  return (
    <button>
      Report as Full
    </button>
  );
}

function ListRooms() {
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
        <FullButton />
        <EmptyButton />
      </Collapsible>
    </li>
  ) : 'error';

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
  return (
    <div>
      <h1>List of Rooms</h1>
      <ScrollableList />
    </div>
  );
}