//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'


/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/


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

function ListRooms() {
  const listRooms = rooms.map(room =>
    <li key={room.number}>
      <h1>
        <b>{room.number}</b>
      </h1>
      <p>
          Reported as: {' ' + room.status + ' '}
          at: {room.lastReported}
      </p>
      <FullButton/>
      <EmptyButton/>
    </li>
  );
  return <ul style={{listStyle: 'none' }}>{listRooms}</ul>;
}


function ScrollableList() {
  return (
    <div style={{ height: '800px', overflow: 'scroll', overflowX: "hidden" }}>
      <ListRooms/>
    </div>
  );
}


export default function MyApp() {
  return (
    <div>
      <h1>List of Rooms</h1>
        <ScrollableList/>
    </div>
  );
}