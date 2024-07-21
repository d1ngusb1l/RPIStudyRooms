import { useEffect, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { Floors, FloorsContext, FloorsDef, RoomContext, Rooms, RoomsDef, RoomStatusEnum, validateType } from './types';
import RoomListing from './RoomListing';
import { StatusCalculation } from './StatusCalculation';
import { NoiseLevelReporter } from './NoiseLevels';

import logo from "./assets/rpistudyroomslogo.png";
import mapplaceholder from "./assets/mapplaceholder.png";
import { stat } from 'fs';


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


  //ugly as heck but is a 3n solution to sorting this datastructure
  //so cope I guess, index 0 is room number, index 1 is the data, index 2 is the estimation of the room
  let certainlyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let likelyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let possiblyOccupiedRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let uncertainRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let possiblyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let likelyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number; }, string][] = [];
  let certainlyEmptyRooms: [string, { status: RoomStatusEnum; lastReported: number;}, string][] = [];

  //iterating through our dictionary object and placing each room in the right container
  rooms ? Object.entries(rooms).forEach(room => {
    let status = StatusCalculation(room[1]);

    //creating a slightly larger version of the room datastructure to store the status of the room
    let modifiedRoom: [string, { status: RoomStatusEnum; lastReported: number;}, string] 
    = [room[0], {status: room[1].status, lastReported: room[1].lastReported}, status]; 

    //checking the status and adding the room to the appropriate group
    if(status == "Certainly Occupied") {certainlyOccupiedRooms.push(modifiedRoom);}
    else if(status == "Likely Occupied") {likelyOccupiedRooms.push(modifiedRoom);}
    else if(status == "Possibly Occupied") {possiblyOccupiedRooms.push(modifiedRoom);}
    else if(status == "Possibly Empty") {possiblyEmptyRooms.push(modifiedRoom);}
    else if(status == "Likely Empty") {likelyEmptyRooms.push(modifiedRoom);}
    else if(status == "Certainly Empty") {certainlyEmptyRooms.push(modifiedRoom);}
    else {uncertainRooms.push(modifiedRoom)}
  }): 'error' ;

  //creating the array we will ultimately map our ui element onto
  let sortedRooms: [string, { status: RoomStatusEnum; lastReported: number;}, string][] = [];

  //adding our rooms in order to our mappable array
  certainlyEmptyRooms.forEach(room => { sortedRooms.push(room);});
  likelyEmptyRooms.forEach(room => {sortedRooms.push(room);});
  possiblyEmptyRooms.forEach(room => {sortedRooms.push(room);});
  uncertainRooms.forEach(room => {sortedRooms.push(room);});
  possiblyOccupiedRooms.forEach(room => {sortedRooms.push(room);});
  likelyOccupiedRooms.forEach(room => {sortedRooms.push(room);});
  certainlyOccupiedRooms.forEach(room => {sortedRooms.push(room);});

  //mapping our array to the ui element
  const listRooms = sortedRooms.map(([roomNumber, room, chance]) =>
    <li key={roomNumber}>
      <RoomListing room={room} roomNumber={roomNumber} chance={chance} />
    </li>
  )

  //returning our list of rooms
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
      <div className="flex-container">
        <header className="title">
          <img src={logo} alt="Logo" className="logo" />
          <h2>RPIStudyRooms</h2>
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

