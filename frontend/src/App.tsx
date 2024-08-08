import { useEffect, useMemo, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { Building, BuildingContext, BuildingContextType, Buildings, BuildingsDef, validateType } from './types';
import ListRooms from './RoomListing';
import { NoiseLevelReporter } from './NoiseLevels';
import logo from "./assets/rpistudyroomslogo.png";
import folsomFloor3 from "./assets/folsom3.png";
import folsomFloor4 from "./assets/folsom4.png";
import bartonFloor1 from "./assets/barton1.png";
import bartonFloor2 from "./assets/barton2.png";
import bartonFloor3 from "./assets/barton3.png";
import bartonFloor4 from "./assets/barton4.png";
import legend from "./assets/legend.png"
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Menu, MenuButton } from './Menu';


/* This is where the dropdown menu is handled! Edit the buttons in here to add the functions */

/* Floor dropdown menu that changes floor map displayed */
function FloorDropdown({currentBuilding, setCurrentFloor }: {currentBuilding : string,  setCurrentFloor: (floor: "3" | "4") => unknown }) {

  if(currentBuilding == "folsom") {
    return (
      <Menu outerLabel="Floors">
        <MenuButton onClick={() => { setCurrentFloor("3"); }}>3</MenuButton>
        <MenuButton onClick={() => { setCurrentFloor("4"); }}>4</MenuButton>
      </Menu >
    )
  }
  else if (currentBuilding == "barton") {
    return (
      <Menu outerLabel="Floors">
        <MenuButton onClick={() => { setCurrentFloor("1"); }}>1</MenuButton>
        <MenuButton onClick={() => { setCurrentFloor("2"); }}>2</MenuButton>
        <MenuButton onClick={() => { setCurrentFloor("3"); }}>3</MenuButton>
        <MenuButton onClick={() => { setCurrentFloor("4"); }}>4</MenuButton>
      </Menu >
    )
  }

}

const floorMapURLs = {
  "folsom" : {
    "3" : folsomFloor3,
    "4" : folsomFloor4
  },
  "barton" : {
    "1" : bartonFloor1,
    "2" : bartonFloor2,
    "3" : bartonFloor3,
    "4" : bartonFloor4,
  }
} as const;

/* Building dropdown menu that changes building map displayed */
function BuildingDropdown({ setCurrentBuilding }: { setCurrentBuilding: (building: "folsom" | "barton") => unknown }) {

  return (
    <Menu outerLabel="Buildings">
      <MenuButton onClick={() => { setCurrentBuilding("folsom"); }}>Folsom Library</MenuButton>
      <MenuButton onClick={() => { setCurrentBuilding("barton"); }}>Barton Hall</MenuButton>
    </Menu >
  )
}

/* Filter selection screen */

const Checkbox = ({ label, value, onChange}) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

/* Main method app code*/
export default function MyApp() {

  //functions for changing whether the map and legend are displayed
  const [isActive, setIsActive] = useState(true);
  const [isLegendActive, setLegendIsActive] = useState(false);
  const [isNoiseActive, setNoiseIsActive] = useState(false);
  const [isFiltersActive, setFiltersIsActive] = useState(false);

  const toggleMap = () => {
    setIsActive(current => !current);
  }

  const toggleLegend = () => {
    setLegendIsActive(current => !current);
  }

  const toggleNoise = () => {
    setNoiseIsActive(current => !current);
    setFiltersIsActive(false);
  }

  const toggleFilters = () => {
    setNoiseIsActive(false);
    setFiltersIsActive(current => !current);
  }

  //framework for switching between buildings easily
  const [buildings, setBuildings] = useState<Buildings | null>(null);
  const [currentBuilding, setCurrentBuilding] = useState<"folsom" | "barton">("folsom");

  useEffect(() => {
    fetch(backendURL("/api/buildings")).then(async (r) => {
      const data = await r.json();
      setBuildings(validateType(BuildingsDef, data));
    });

    const interval = setInterval(() => {
      fetch(backendURL("/api/buildings")).then(async (r) => {
        const data = await r.json();
        setBuildings(validateType(BuildingsDef, data));
      })
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, []);


  //filters
  const [filters, setFilters] = useState([]);
  
  const [checkboxStates, setCheckboxStates] = useState({
    window: false,
    table: false,
    outlet: false,
    ethernet: false,
    blackboard: false,
    whiteboard: false,
  });

  const handleCheckboxChange = (filter) => {
    setCheckboxStates((prevState) => {
      const newState = { ...prevState, [filter]: !prevState[filter] };

      if (newState[filter]) {
        setFilters((prevFilters) => [...prevFilters, filter]);
      } else {
        setFilters((prevFilters) => prevFilters.filter((f) => f !== filter));
      }

      return newState;
    });
  };


  //potential replacement for backend call once I can get it working ;w;
  //setFloors(validateType(FloorsDef, building?.floors));

  //for switching between floors of a building
  const [currentFloor, setCurrentFloor] = useState<keyof Building["floors"]>("3");


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

  const buildingContextData: BuildingContextType | null = useMemo(() => {
    if (buildings && buildings[currentBuilding]) {
      const ret: BuildingContextType = {
        building: buildings[currentBuilding],
        buildingKey: currentBuilding,
        updateBuilding: (building) => {
          setBuildings({ ...buildings, [currentBuilding]: building });
        },
        currentFloorKey: currentFloor,
        currentFloor: buildings[currentBuilding].floors[currentFloor],
        updateAllFloors: (floors) => {
          setBuildings({ ...buildings, [currentBuilding]: { ...buildings[currentBuilding], floors } });
        },
        updateFloor: (floorKey, floor) => {
          setBuildings({ ...buildings, [currentBuilding]: { ...buildings[currentBuilding], floors: { ...buildings[currentBuilding].floors, [floorKey]: floor } } });
        },
        rooms: buildings[currentBuilding].rooms,
        updateRoom: (roomKey, room) => {
          setBuildings({ ...buildings, [currentBuilding]: { ...buildings[currentBuilding], rooms: { ...buildings[currentBuilding].rooms, [roomKey]: room } } });
        },
        updateAllRooms: (rooms) => {
          setBuildings({ ...buildings, [currentBuilding]: { ...buildings[currentBuilding], rooms } });
        }
      };
      return ret;
    } else {
      return null;
    }
  }, [buildings, currentBuilding, currentFloor]);

  /* UI formatting*/
  return (
    <div>
      <header className="title">
        <img src={logo} alt="Logo" className="logo" />
        <h2>RPIStudyRooms</h2>


        <div className="floorbutton-and-legend-display">
          <button onClick={toggleMap}>Display Map</button>
          <button onClick={toggleLegend}>Display Legend</button>
        </div>

        <div className="feedbacklink">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdhawJh8TH_RB4fMmowpS-CwPTQL1xr-HOYfV7MMB8gyib6dQ/viewform?usp=sf_link" target="_blank">
            Come give us feedback!</a>
        </div>

      </header>
      {buildingContextData && <BuildingContext.Provider value={buildingContextData}>
        <div className="content-and-map">
          <div className="content">
            <div className="legend-without-map" style={{ display: (isLegendActive && !isActive) ? 'flex' : 'none' }}>
              <img src={legend} className='legend' />
            </div>

            <div className="buttons-row">

              <button onClick={toggleNoise} style={{ display: isNoiseActive || isFiltersActive ? 'none' : 'flex' }}>Noise Level</button>
              <div className="collapsible-noise" style={{ display: isNoiseActive ? 'flex' : 'none' }} >
                <div className="buttons-row">

                  <button onClick={toggleNoise}>Hide</button>
                  <button onClick={toggleFilters} style={{ display: isNoiseActive ? 'flex' : 'none' }} >Filters</button>

                </div>
                <div className='noise-level'>
                  <NoiseLevelReporter />
                </div>
              </div>
              
              <button onClick={toggleFilters} style={{ display: isNoiseActive || isFiltersActive ? 'none' : 'flex' }} >Filters</button>

              <div className="collapsible-noise" style={{ display: isFiltersActive ? 'flex' : 'none' }} >
                <div className="buttons-row">
                  <button onClick={toggleNoise} style={{ display: isFiltersActive ? 'flex' : 'none' }}>Noise Level</button>
                  <button onClick={toggleFilters}>Hide</button>

                </div>
                <div className='noise-level'>
                  <div>
                      <div><p style={{ margin: '1px auto', fontWeight: 'bold' }}>Filter Room Tags</p></div>
                        <div className = "checkboxes">
                          <Checkbox
                            label="Window"
                            value={checkboxStates.window}
                            onChange={() => handleCheckboxChange('window')}
                          />
                          <Checkbox
                            label="Table"
                            value={checkboxStates.table}
                            onChange={() => handleCheckboxChange('table')}
                          />
                          <Checkbox
                            label="Outlet"
                            value={checkboxStates.outlet}
                            onChange={() => handleCheckboxChange('outlet')}
                          />
                          <Checkbox
                            label="Ethernet"
                            value={checkboxStates.ethernet}
                            onChange={() => handleCheckboxChange('ethernet')}
                          />
                          <Checkbox
                            label="Blackboard"
                            value={checkboxStates.blackboard}
                            onChange={() => handleCheckboxChange('blackboard')}
                          />
                          <Checkbox
                            label="Whiteboard"
                            value={checkboxStates.whiteboard}
                            onChange={() => handleCheckboxChange('whiteboard')}
                          />
                        </div>
                        <p>Active Filters: {filters.join(', ')}</p>
                  </div>
                </div>
              </div>


            </div>
            <div className="list-header">
              <h2>List of Rooms</h2>
              <FloorDropdown currentBuilding={currentBuilding} setCurrentFloor={setCurrentFloor} />
              <BuildingDropdown setCurrentBuilding={setCurrentBuilding} />
            </div>
            <div className="scrollable-list">
              {buildings && buildings[currentBuilding].rooms
                && <ListRooms filters={filters} />}
            </div>
          </div>
          <div className='map-container' style={{ display: isActive ? 'flex' : 'none' }} /*style={{display : isActive ? 'flex' : 'none',
              alignItems: isActive ? 'center' : '',}} */>
            <TransformWrapper>
              <div className='map-canvas' >
                <div className='controller'/*style={{outline: 'auto'}} */><Controls /></div>
                <div className='canvas'>
                  <TransformComponent>
                    <img src={floorMapURLs[currentBuilding][currentFloor]} className='map' />
                  </TransformComponent>
                </div>
              </div>
              <img src={legend} className='legend' style={{ display: isLegendActive ? 'flex' : 'none' }} />
            </TransformWrapper>
          </div>
        </div>
      </BuildingContext.Provider>}
    </div>
  );
}

