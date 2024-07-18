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

  /*Scrollable list probably needs to have it's height capped */

  return (
    <div className="scrollable-list" style={{ maxHeight: '700px', overflow: 'scroll', overflowX: "hidden" }}>
      <ListRooms />
    </div>
  );
}

export default function MyApp() {

  const [isActive, setIsActive] = useState(false);

  const toggleMap = () => {

    setIsActive(current => !current);

  }

  return (
    <body>
        <div className="flex-container">
          <header className="title">
            <img src={logo} alt="Logo" className="logo" />
            <h2>RPIStudyRooms</h2>
          </header>
          <div className="content-and-map">
            <div className="content">
              <div className="rooms-and-map-button">
                <h2>List of Rooms</h2>
                <NoiseLevelReporter/>
                <button onClick={() => toggleMap}>Display Map</button>
              </div>
              <ScrollableList/>
            </div>
            <div className='map-container' /*style={{display : isActive ? 'flex' : 'none',
              alignItems: isActive ? 'center' : '',
            }} */>
              <img src={mapplaceholder} className='map' />
            </div>
          </div> 
        </div>
    </body>
  );
}

