import './App.css'
import Collapsible from "./Collapsible";


const rooms = [
  {number: 101, status: "full", lastReported: "7:08 am"},
  {number: 102, status: "full", lastReported: "9:07 am"},
  {number: 103, status: "empty", lastReported: "8:35 am"},
  {number: 104, status: "empty", lastReported: "11:52 am"},
  {number: 105, status: "empty", lastReported: "3:36 pm"},
  {number: 106, status: "full", lastReported: "2:12 pm"},
  {number: 107, status: "empty", lastReported: "5:31 pm"},
  {number: 108, status: "full", lastReported: "4:46 pm"},
  {number: 109, status: "full", lastReported: "5:11 pm"},
  {number: 110, status: "empty", lastReported: "6:13 pm"},
];

function EmptyButton() {
  return (
    <button>
      Report as Empty
    </button>
  );
}

function FullButton() {
  return (
    <button>
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
  const listRooms = rooms.map(room =>
    <li key={room.number}>
      <Collapsible title= {room.number.toString()}>
        <p>
            Reported as: {' ' + room.status + ' '}
            at: {room.lastReported}
        </p>
        <FullButton/>
        <EmptyButton/>
      </Collapsible>
    </li>
  );
  return <ul style={{listStyle: 'none' }}>{listRooms}</ul>;
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