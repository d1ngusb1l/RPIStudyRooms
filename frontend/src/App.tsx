import { useEffect, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { Room, RoomDef, validateType } from './types';
import { Type } from '@sinclair/typebox';
import RoomListing from './RoomListing';


function MapButton() {

  return (
    <button style={{ width: '10px', height: '10px' }}>

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
      setRooms(validateType(Type.Array(RoomDef), data));
    })
  }, [])

  const listRooms = rooms ? rooms.map(room =>
    <li key={room.number}>
      <RoomListing room={room} />
    </li>
  ) : 'error';

  return <ul style={{ listStyle: 'none' }}>{listRooms}</ul>;
}


function ScrollableList() {
  return (
    <div className="scrollable-list" style={{ height: '800px', overflow: 'scroll', overflowX: "hidden" }}>
      <ListRooms />
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
            <ScrollableList />
          </div>
          <img src="/src/assets/mapplaceholder.png" className="map" />
        </div>
      </div>
    </body>
  );
}

