import {useEffect, useState} from 'react';
import './App.css'
import Collapsible from "./Collapsible";
import { Type, type Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { backendURL } from './utils';

const RoomDef = Type.Object({
  number: Type.String(),
  status: Type.String(),
  lastReported: Type.String()
})
type Room = Static<typeof RoomDef>
const RoomArrayDef = Type.Array(RoomDef)


function EmptyButton({ rNum }: { rNum: string }) {

  function handleClick() {
    console.log(rNum);
  }

  return (
    <button onClick={() => handleClick}>
      Report as Empty
    </button>
  );
}


function FullButton({ rNum }: { rNum: string }) {

  function handleClick() {
    console.log(rNum);
  }

  return (
    <button onClick={() => handleClick}>
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
    <li key={room.number}>
      <Collapsible title={room.number}>
        <p>
          Reported as: {' ' + room.status + ' '}
          at: {new Date(room.lastReported).toLocaleTimeString()}
        </p>
        <FullButton rNum={room.number}/>
        <EmptyButton rNum={room.number}/>
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

