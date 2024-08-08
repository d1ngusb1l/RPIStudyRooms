import { Room, RoomStatusEnum } from "./types";
import roomOpen from "./assets/roomOpen.png";
import roomLEmpty from "./assets/roomLEmpty.png";
import roomPEmpty from "./assets/roomPEmpty.png";
import roomUncertain from "./assets/roomUncertain.png";
import roomPOccupied from "./assets/roomPOccupied.png";
import roomLOccupied from "./assets/roomLOccupied.png";
import roomClosed from "./assets/roomClosed.png";


export enum RoomProbability {
  CertainlyOccupied = "Certainly Occupied",
  LikelyOccupied = "Likely Occupied",
  PossiblyOccupied = "Possibly Occupied",
  Uncertain = "Uncertain",
  PossiblyEmpty = "Possibly Empty",
  LikelyEmpty = "Likely Empty",
  CertainlyEmpty = "Certainly Empty",
  Closed = "Closed",
  Reserved = "Reserved",
  Available = "Available",
}

// Determines the probablity of a room being open or occupied.
export function StatusCalculation(room: Room): RoomProbability {
  const reportTime = new Date(room.lastReported);
  const currentTime = new Date();
  //time difference in milliseconds
  let timeDiff = currentTime.getTime() - reportTime.getTime();
  //converting to seconds
  timeDiff /= 1000;
  //converting to minutes
  timeDiff /= 60;

  switch (room.status) {
    case RoomStatusEnum.Full: {
      if (timeDiff <= 60) {
        return RoomProbability.CertainlyOccupied;
      } else if (timeDiff <= 90) {
        return RoomProbability.LikelyOccupied;
      } else if (timeDiff <= 120) {
        return RoomProbability.PossiblyOccupied;
      } else {
        return RoomProbability.Uncertain;
      }
    }
    case RoomStatusEnum.Empty: {
      if (timeDiff <= 10) {
        return RoomProbability.CertainlyEmpty;
      } else if (timeDiff <= 20) {
        return RoomProbability.LikelyEmpty;
      } else if (timeDiff <= 30) {
        return RoomProbability.PossiblyEmpty;
      } else {
        return RoomProbability.Uncertain;
      }
    }
    case RoomStatusEnum.PersonalUse: {
      const endTime = new Date(room.claimedUntil!);
      if (currentTime < endTime) {
        return RoomProbability.CertainlyOccupied;
      } else {
        return RoomProbability.Uncertain;
      }
    }
    default:
      return RoomProbability.Closed;
  }
}

// Takes a probability and returns a color to match it
export function colorCalc(status: string) {
  switch (status) {
    case "Certainly Empty":
      return "#4CFF00";
    case "Likely Empty":
      return "#6BB200";
    case "Possibly Empty":
      return "#CCFF00";
    case "Uncertain":
      return "#FFFF00";
    case "Possibly Occupied":
      return "#FFBB00";
    case "Likely Occupied":
      return "#FF6A00";
    case "Certainly Occupied":
      return "#FF0000";
    case "Closed":
      return "#808080";
    case "Reserved":
      return "#0026FF";
    case "Available":
      return "#4CFF00";
    default:
      return "#FFFFFF";
  }
}

// Takes a probability and returns a door symbol to match it
export function doorCalc(status: string) {
  switch (status) {
    case "Certainly Empty":
      return roomOpen;
    case "Likely Empty":
      return roomLEmpty;
    case "Possibly Empty":
      return roomPEmpty;
    case "Uncertain":
      return roomUncertain;
    case "Possibly Occupied":
      return roomPOccupied;
    case "Likely Occupied":
      return roomLOccupied;
    case "Available":
      return roomOpen;
    default:
      return roomClosed;
  }
}

// Makes a color to be darker for text to be more readable on top of it
export function adjust(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}
