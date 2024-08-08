import { Building, Room, RoomDef, RoomStatusEnum } from "./types";
import roomOpen from "./assets/roomOpen.png";
import roomLEmpty from "./assets/roomLEmpty.png";
import roomPEmpty from "./assets/roomPEmpty.png";
import roomUncertain from "./assets/roomUncertain.png";
import roomPOccupied from "./assets/roomPOccupied.png";
import roomLOccupied from "./assets/roomLOccupied.png";
import roomClosed from "./assets/roomClosed.png";

const Folsom_Library = {
  hours: {
    monday: [new Date(1999, 11, 1, 12), new Date(1999, 11, 1, 20)],
    tuesday: [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
    wednesday: [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
    thursday: [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
    friday: [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 17)],
    saturday: [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
    sunday: [new Date(1999, 11, 1, 8), new Date(1999, 11, 1, 20)],
  },
};

export function isClosed() {
  const currentDate = new Date();
  const currentTime = currentDate.getHours();
  const day = currentDate.getDay();
  let openingTime;
  let closingTime;
  let pass = true;

  switch (day) {
    case 0:
      openingTime = Folsom_Library.hours.sunday[0].getHours();
      closingTime = Folsom_Library.hours.sunday[1].getHours();
      break;
    case 1:
      openingTime = Folsom_Library.hours.monday[0].getHours();
      closingTime = Folsom_Library.hours.monday[1].getHours();
      break;
    case 2:
      openingTime = Folsom_Library.hours.tuesday[0].getHours();
      closingTime = Folsom_Library.hours.tuesday[1].getHours();
      break;
    case 3:
      openingTime = Folsom_Library.hours.wednesday[0].getHours();
      closingTime = Folsom_Library.hours.wednesday[1].getHours();
      break;
    case 4:
      openingTime = Folsom_Library.hours.thursday[0].getHours();
      closingTime = Folsom_Library.hours.thursday[1].getHours();
      break;
    case 5:
      openingTime = Folsom_Library.hours.friday[0].getHours();
      closingTime = Folsom_Library.hours.friday[1].getHours();
      break;
    case 6:
      openingTime = Folsom_Library.hours.sunday[0].getHours();
      closingTime = Folsom_Library.hours.sunday[1].getHours();
      break;
    default:
      openingTime = Folsom_Library.hours.sunday[0].getHours();
      closingTime = Folsom_Library.hours.sunday[1].getHours();
      pass = false;
      break;
  }

  if (
    ((openingTime < currentTime && currentTime < closingTime) ||
      (openingTime == currentTime &&
        currentDate.getSeconds() > 0 &&
        currentTime < closingTime)) &&
    pass == true
  ) {
    return "Open";
  }
  return "Closed";
}

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
      if (timeDiff <= 30) {
        return RoomProbability.CertainlyOccupied;
      } else if (timeDiff <= 60) {
        return RoomProbability.LikelyOccupied;
      } else if (timeDiff <= 90) {
        return RoomProbability.PossiblyOccupied;
      } else {
        return RoomProbability.Uncertain;
      }
    }
    case RoomStatusEnum.Empty: {
      if (timeDiff <= 30) {
        return RoomProbability.CertainlyEmpty;
      } else if (timeDiff <= 60) {
        return RoomProbability.LikelyEmpty;
      } else if (timeDiff <= 90) {
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

export function colorCalc(status: String) {
  switch (status) {
    case "Certainly Empty":
      return "#4CFF00";
    case "Likely Empty":
      return "#7FFF00";
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

export function doorCalc(status: String) {
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
