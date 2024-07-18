import { useEffect, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { RoomContext, Rooms, RoomsDef, validateType } from './types';
import RoomListing from './RoomListing';
import { NoiseLevelReporter } from './NoiseLevels';

import logo from "./assets/rpistudyroomslogo.png";
import mapplaceholder from "./assets/mapplaceholder.png";


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

  const [rooms, setRooms] = useState<Rooms | null>(null);

  useEffect(() => {
    fetch(backendURL("/api/database")).then(async (res) => {
      const data = await res.json();
      setRooms(validateType(RoomsDef, data));
    })
  }, [])

  const listRooms = rooms ? Object.entries(rooms).map(([roomNumber, room]) =>
    <li key={roomNumber}>
      <RoomListing room={room} roomNumber={roomNumber} />
    </li>
  ) : 'error';

  return rooms !== null && <RoomContext.Provider value={{ rooms, update: setRooms }}><ul style={{ listStyle: 'none' }}>{listRooms}</ul></RoomContext.Provider>;
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
          <img src={logo} alt="Logo" className="logo" />
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
          <NoiseLevelReporter/>
          <img src={mapplaceholder} className="map" />
        </div>
      </div>
    </body>
  );
}

