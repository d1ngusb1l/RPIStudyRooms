import React from "react";
import Collapsible from "./Collapsible";
import { Room } from "./types";

function EmptyButton({ rNum }: { rNum: string }) {

    function handleClick() {
      console.log(rNum);
    }
  
    return (
      <button onClick={() => handleClick}>
        Report as Empty
      </button>
    );
  }
  
  
  function FullButton({ rNum }: { rNum: string }) {
  
    function handleClick() {
      console.log(rNum);
    }
  
    return (
      <button onClick={() => handleClick}>
        Report as Full
      </button>
    );
  }
  

export default function RoomListing({ room }: { room: Room }) {
    return <Collapsible title={room.number}>
    <p>
      Reported as: {' ' + room.status + ' '}
      at: {new Date(room.lastReported).toLocaleTimeString()}
    </p>
    <FullButton rNum={room.number}/>
    <EmptyButton rNum={room.number}/>
  </Collapsible>
}