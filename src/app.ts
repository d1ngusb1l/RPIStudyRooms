import express, { Request, Response, type Express } from "express";
import "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Type, type Static } from "@sinclair/typebox";
import cors from "cors";
import {
  ErrorType,
  Rooms,
  Room,
  RoomStatusEnum,
  Floors,
  Floor,
  NoiseReport,
  NoiseReportDef,
  Building,
  Buildings,
} from "./types.js";
import { allBuildings, bartonHall, floors, folsomLibrary, folsomRooms } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectBase = path.resolve(__dirname, "../");
const frontendBase = path.join(projectBase, "frontend");
const frontendDistBase = path.join(frontendBase, "dist");

const app = express();
app.use(express.static(frontendDistBase));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistBase, "index.html"));
  });
}

const port = Number(process.env.PORT) || 5001;

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

let displayAsClosed = false;

function isClosed() {
  let currentDate = new Date();
  let currentTime = currentDate.getHours();
  let day = currentDate.getDay();
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
  /*
  console.log({
    openingTime,
    currentTime,
    closingTime,
    pass,
    conds: [
      openingTime < currentTime,
      currentTime < closingTime,
      openingTime < currentTime && currentTime < closingTime,
      openingTime == currentTime,
      currentDate.getSeconds() > 0,
      currentTime < closingTime,
      openingTime == currentTime &&
        currentDate.getSeconds() > 0 &&
        currentTime < closingTime,
      pass,
    ],
  });*/

  if (
    ((openingTime < currentTime && currentTime < closingTime) ||
      (openingTime == currentTime &&
        currentDate.getSeconds() > 0 &&
        currentTime < closingTime)) &&
    pass == true
  ) {
    return false;
  }
  return true;
}

function dbCleanup() {
  //getting rid of noise reports that are more
  //than an hour old
  let nrOld = floors["3"].noiseReports;
  let nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  floors["3"].noiseReports = nrNew;

  nrOld = floors["4"].noiseReports;
  nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  floors["4"].noiseReports = nrNew;

  // console.log("Closed: " + isClosed());

  //setting rooms as closed when library is closed
  /*
  if (isClosed()) {
    for (const [roomNum, info] of Object.entries(folsomRooms)) {
      info.status = RoomStatusEnum.Closed;
      info.lastReported = Date.now();
      info.claimedUntil = undefined;
    }
    displayAsClosed = true;
  } else if (displayAsClosed) {
    for (const [roomNum, info] of Object.entries(folsomRooms)) {
      info.status = RoomStatusEnum.Empty;
      info.lastReported = Date.now();
      info.claimedUntil = undefined;
    }
  }*/

  console.log("cleanup performed sucessfully!");
}

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    dbCleanup();
    setInterval(dbCleanup, 60000);
    console.log("Listening on *:" + port);
  });
}

app.get("/api/folsomLibrary", (req, res: Response<Building>, next) => {
  res.json(folsomLibrary);
});

app.get("/api/buildings", (req, res: Response<Buildings>, next) => {
  res.json(allBuildings);
});

app.post(
  "/api/:building/reportAsFull/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    const room = allBuildings[req.params.building].rooms[req.params.roomNumber];
    if (!room) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      room.status = RoomStatusEnum.Full;
      room.lastReported = Date.now();
      room.claimedUntil = undefined;
      res.json(room);
    }
  }
);

app.post(
  "/api/:building/reportAsEmpty/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    const room = allBuildings[req.params.building].rooms[req.params.roomNumber];
    if (!room) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {

        room.status = RoomStatusEnum.Empty;
        room.lastReported = Date.now();
        room.claimedUntil = undefined;
        res.json(room);
    }
  }
);

app.post(
  "/api/:building/reportAsPersonalUse/:roomNumber/:durationMins",
  (req, res: Response<Room | ErrorType>) => {
    const room = allBuildings[req.params.building].rooms[req.params.roomNumber];
    if (isNaN(Number(req.params.durationMins))) {
      return res.status(400).json({
        status: 400,
        message: "Invalid duration.",
      });
    }
    if (!room) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      room.status = RoomStatusEnum.PersonalUse;
      room.lastReported = Date.now();
      room.claimedUntil =
      room.lastReported +
        Number(req.params.durationMins) * 60 * 1000;
      res.json(room);
    }
  }
);

app.get("/api/floors", (req, res: Response<Floors>) => {
  res.json(floors);
});

app.post(
  "/api/:building/addNoiseReport/:floor/:noiseLevel",
  (req, res: Response<ErrorType | NoiseReport>) => {
    const floor = allBuildings[req.params.building].floors[req.params.floor];
    if (!floor) {
      res.status(404).json({
        status: 404,
        message: "Floor not found.",
      });
      return;
    }
    const noiseLevel = Number(req.params.noiseLevel);
    if (isNaN(noiseLevel)) {
      res.status(404).json({
        status: 404,
        message: "Invalid noise level.",
      });
      return;
    }
    const newNoiseReport: NoiseReport = {
      timeReported: Date.now(),
      noiseLevel,
    };
    floor.noiseReports.push(newNoiseReport);
    res.json(newNoiseReport);
  }
);

export default app;
