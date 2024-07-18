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

function MapButton() {

  return (
    <button style={{width:'10px', height:'10px'}}>
      
    </button>
  );
  
}

// function maptoggle(){
//     document.getElementById("myDIV").style.display = "none"
// }


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
    <div className="scrollable-list" style={{ height: '800px', overflow: 'scroll', overflowX: "hidden" }}>
      <ListRooms/>
    </div>
  );
}

export default function MyApp() {
  return (
    <body>
        <div className="flex-container">
          <header className="title">
            <img src="/src/assets/rpistudyroomslogo.png" alt="Logo" className="logo" />
            <h1>RPIStudyRooms</h1>
          </header>
          <div className="content-and-map">
            <div className="content">
              <div className="rooms-and-map-button">
                <h1>List of Rooms</h1>
                <button>Display Map</button>
                {/* <button onClick={maptoggle} >Display Map</button> */}
              </div>
              <ScrollableList/>
            </div>
            <img src="/src/assets/mapplaceholder.png" className="map"/>
          </div> 
        </div>
    </body>
  );
}

