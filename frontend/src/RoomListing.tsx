import { useContext } from "react";
import Collapsible from "./Collapsible";
import { Room, RoomContext, RoomDef, validateType } from "./types";
import { backendURL } from "./utils";

function EmptyButton({ rNum }: { rNum: string }) {
  const { rooms, update } = useContext(RoomContext);

  return (
    <button onClick={() => fetch(backendURL("/api/reportAsEmpty/" + rNum), { method: "POST" }).then(async (r) => {
      const data = await r.json();
      const newRoom = validateType(RoomDef, data);
      update({ ...rooms, [rNum]: newRoom });
    })}>
      Report as Empty
    </button>
  );
}


function FullButton({ rNum }: { rNum: string }) {
  const { rooms, update } = useContext(RoomContext);

  return (
    <button onClick={() => fetch(backendURL("/api/reportAsFull/" + rNum), { method: "POST" }).then(async (r) => {
      const data = await r.json();
      const newRoom = validateType(RoomDef, data);
      update({ ...rooms, [rNum]: newRoom });
    })}>
      Report as Full
    </button>
  );
}


export default function RoomListing({ room, roomNumber, chance}: { room: Room, roomNumber: string, chance: string }) {
  return <Collapsible title={roomNumber}>
    <p>Reported as: {' ' + room.status + ' '}</p>
    <p>at: {new Date(room.lastReported).toLocaleTimeString()}</p>
    <p>Our Estimation: {chance}</p>
    <FullButton rNum={roomNumber} />
    <EmptyButton rNum={roomNumber} />
  </Collapsible>
}