import { useEffect, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { Floors, FloorsContext, FloorsDef, RoomContext, Rooms, RoomsDef, RoomStatusEnum, validateType } from './types';
import ListRooms from './RoomListing';
import { NoiseLevelReporter } from './NoiseLevels';
import logo from "./assets/rpistudyroomslogo.png";
import folsomFloor3 from "./assets/folsom3.png";
import folsomFloor4 from "./assets/folsom4.png";
import { Menu, MenuButton } from './Menu';

function MapButton() {

  return (
    <button style={{ width: '10px', height: '10px' }}>

    </button>
  );

}


function ScrollableList() {

  /*Scrollable list probably needs to have it's height capped */

  return (
    <div className="scrollable-list" style={{ maxHeight: '475px', overflow: 'scroll', overflowX: "hidden", border: '2px solid rgb(109, 109, 109)', }}>
      <ListRooms />
    </div>
  );
}

/* This is where the dropdown menu is handled! Edit the buttons in here to add the functions */
function FloorDropdown({ floorMap, changeFloorMap }: { floorMap: string, changeFloorMap: (path: string) => unknown }) {
  function f3() { changeFloorMap(folsomFloor3); }
  function f4() { changeFloorMap(folsomFloor4); }

  return (
    <Menu outerLabel="Floors">
      <MenuButton onClick={f3}>3</MenuButton>
      <MenuButton onClick={f4}>4</MenuButton>
    </Menu >
  )
}

export default function MyApp() {
  const [floors, setFloors] = useState<Floors | null>(null);
  const [currentFloor, setCurrentFloor] = useState("3");

  const [floorMap, changeFloorMap] = useState(folsomFloor3);

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
            <div className="buttons-row">
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
              <div className="floorbutton-and-mapdisplay">
                <button onClick={() => toggleMap}>Display Map</button>
                <FloorDropdown changeFloorMap={changeFloorMap} />
              </div>
            </div>
            <ScrollableList />
          </div>
          <div className='map-container' /*style={{display : isActive ? 'flex' : 'none',
              alignItems: isActive ? 'center' : '',
            }} */>
            <img src={floorMap} className='map' />
          </div>
        </div>
      </div>
    </body>
  );
}

