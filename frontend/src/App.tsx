import { useEffect, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { Floors, FloorsContext, FloorsDef, RoomContext, Rooms, RoomsDef, validateType } from './types';
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
    <div className="scrollable-list" style={{ maxHeight: '700px', overflow: 'scroll', overflowX: "hidden" , border: '2px solid rgb(109, 109, 109)',}}>
      <ListRooms />
    </div>
  );
}

export default function MyApp() {
  const [floors, setFloors] = useState<Floors | null>(null);
  const [currentFloor, setCurrentFloor] = useState("3");

  const [isActive, setIsActive] = useState(false);

  const toggleMap = () => {

    setIsActive(current => !current);

  }

  useEffect(() => {
    fetch(backendURL("/api/floors")).then(async (r) => {
      const data = await r.json();
      setFloors(validateType(FloorsDef, data));
    })
  }, []);


  return (
    <body>
      <div>
        <header className="title">
          <img src={logo} alt="Logo" className="logo" />
          <h2>RPIStudyRooms</h2>
          <div className="feedbacklink">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdhawJh8TH_RB4fMmowpS-CwPTQL1xr-HOYfV7MMB8gyib6dQ/viewform?usp=sf_link">
          Come give us feedback!</a>
          </div>
          
        </header>
        <div className="content-and-map">
          <div className="content">
            <div className="rooms-and-map-button">
              <h2>List of Rooms</h2>
              {floors !== null && <FloorsContext.Provider value={{
                floors,
                updateAllFloors: setFloors,
                updateFloor: (floorNum, floor) => {
                  setFloors({ ...floors, [floorNum]: floor });
                }
              }}>
                <NoiseLevelReporter currentFloor={currentFloor} />
              </FloorsContext.Provider>}
              <button onClick={() => toggleMap}>Display Map</button>
            </div>
            <ScrollableList />
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

