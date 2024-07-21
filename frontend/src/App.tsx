import { useEffect, useState } from 'react';
import './App.css'
import { backendURL } from './utils';
import { Floors, FloorsContext, FloorsDef, RoomContext, Rooms, RoomsDef, RoomStatusEnum, validateType } from './types';
import ListRooms from './RoomListing';
import { NoiseLevelReporter } from './NoiseLevels';
import logo from "./assets/rpistudyroomslogo.png";
import folsomFloor3 from "./assets/folsom3.png";
import folsomFloor4 from "./assets/folsom4.png";
import mapplaceholder from "./assets/mapplaceholder.png";
import { stat } from 'fs';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function MapButton() {

  return (
    <button style={{ width: '10px', height: '10px' }}>

    </button>
  );

}


function ScrollableList() {

  /*Scrollable list probably needs to have it's height capped */

  return (
    <div className="scrollable-list" style={{ maxHeight: '700px', overflow: 'scroll', overflowX: "hidden" , border: '2px solid rgb(109, 109, 109)',}}>
      <ListRooms />
    </div>
  );
}

/* This is where the dropdown menu is handled! Edit the buttons in here to add the functions */
function FloorDropdown(){
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Floors
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="dropdown-options">
          <MenuItem>
            <button>3</button>
          </MenuItem>
          <MenuItem>
            <button>4</button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
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
                <FloorDropdown />
              </div>
            </div>
            <ScrollableList />
          </div>
          <div className='map-container' /*style={{display : isActive ? 'flex' : 'none',
              alignItems: isActive ? 'center' : '',
            }} */>
            <img src={folsomFloor3} className='map' />
          </div>
        </div>
      </div>
    </body>
  );
}

