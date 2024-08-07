import { useEffect, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { Building, BuildingDef, Floors, FloorsContext, FloorsDef, RoomsDef, validateType } from './types';
import ListRooms from './RoomListing';
import { NoiseLevelReporter } from './NoiseLevels';
import logo from "./assets/rpistudyroomslogo.png";
import folsomFloor3 from "./assets/folsom3.png";
import folsomFloor4 from "./assets/folsom4.png";
import legend from "./assets/legend.png"
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Menu, MenuButton } from './Menu';


/* This is where the dropdown menu is handled! Edit the buttons in here to add the functions */
function FloorDropdown({ setCurrentFloor }: { setCurrentFloor: (floor: "3" | "4") => unknown }) {
  function f3() { setCurrentFloor("3"); }
  function f4() { setCurrentFloor("4"); }

  return (
    <Menu outerLabel="Floors">
      <MenuButton onClick={f3}>3</MenuButton>
      <MenuButton onClick={f4}>4</MenuButton>
    </Menu >
  )
}

const floorMapURLs = {
  "3": folsomFloor3,
  "4": folsomFloor4
} as const;

export default function MyApp() {


  const [isActive, setIsActive] = useState(true);
  const [isLegendActive, setLegendIsActive] = useState(true);

  const toggleMap = () => {
    setIsActive(current => !current);
  }

  const toggleLegend = () => {
    setLegendIsActive(current => !current);
  }

  const [floors, setFloors] = useState<Floors | null>(null);
  const [currentFloor, setCurrentFloor] = useState<"3" | "4">("3");

  useEffect(() => {
    fetch(backendURL("/api/floors")).then(async (r) => {
      const data = await r.json();
      setFloors(validateType(FloorsDef, data));
    })
  }, []);


  //framework for switching between buildings easily
  const [building, setBuilding] = useState<Building | null>(null);
  useEffect(() => {
    fetch(backendURL("/api/folsomLibrary")).then(async (r) => {
      const data = await r.json();
      setBuilding(validateType(BuildingDef, data));
    })
  }, []);

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <>
        <button onClick={() => zoomIn()}>Zoom In</button>
        <button onClick={() => zoomOut()}>Zoom Out</button>
        <button onClick={() => resetTransform()}>Reset</button>
      </>
    );
  };

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
            <div className="legend-without-map" style={{ display: (isLegendActive && !isActive) ? 'flex' : 'none' }}>
              <img src={legend} className='legend' />
            </div>
            <div className="buttons-row">
              {floors !== null && <FloorsContext.Provider value={{
                floors,
                updateAllFloors: setFloors,
                updateFloor: (floorNum, floor) => {
                  setFloors({ ...floors, [floorNum]: floor });
                }
              }}>
                <div className='noise-level'>
                  <NoiseLevelReporter currentFloor={currentFloor} />
                </div>
              </FloorsContext.Provider>}
              <div className="floorbutton-and-legend-display">
                <button onClick={toggleMap}>Display Map</button>
                <button onClick={toggleLegend}>Display Legend</button>
              </div>
            </div>
            <div className="list-header">
              <h2>List of Rooms</h2>
              <FloorDropdown setCurrentFloor={setCurrentFloor} />
            </div>
              <div className="scrollable-list">
                {building?.rooms && <ListRooms rooms={building.rooms} />}
              </div>
          </div>
          <div className='map-container' style={{ display: isActive ? 'flex' : 'none' }} /*style={{display : isActive ? 'flex' : 'none',
              alignItems: isActive ? 'center' : '',}} */>
            <TransformWrapper>
              <div className='map-canvas' >
                <div className='controller'/*style={{outline: 'auto'}} */><Controls /></div>
                <div className='canvas'>
                  <TransformComponent>
                    <img src={floorMapURLs[currentFloor]} className='map' />
                  </TransformComponent>
                </div>
              </div>
              <img src={legend} className='legend' style={{ display: isLegendActive ? 'flex' : 'none' }} />
            </TransformWrapper>
          </div>
        </div>
      </div>
    </body>
  );
}

