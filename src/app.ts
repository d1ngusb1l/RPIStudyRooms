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
import { allBuildings, bartonFloor1, bartonFloor2, bartonFloor3, bartonFloor4, bartonHall, folsomFloor3, folsomFloor4, folsomLibrary, folsomRooms } from "./db.js";

//various useful constants for filepaths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectBase = path.resolve(__dirname, "../");
const frontendBase = path.join(projectBase, "frontend");
const frontendDistBase = path.join(frontendBase, "dist");

//boiler plate express code
const app = express();
app.use(express.static(frontendDistBase));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//code for connecting to database
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistBase, "index.html"));
  });
}

//port that back end gets runned on
const port = Number(process.env.PORT) || 5001;

// Closing and opening time backend information for Folsom Library
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

//global variable keeping track of whether rooms should display as closed
let displayAsClosed = false;

// Determines whether building is currently closed
function isClosed() {
  //getting current date/time/day of the week
  let currentDate = new Date();
  let currentTime = currentDate.getHours();
  let day = currentDate.getDay();

  //defining opening and closing times
  let openingTime;
  let closingTime;
  let pass = true;

  //setting opening and closing times for the library depending on day of the week
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

  //checking if user is currently within close/open times for given day
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
  //getting rid of noise reports that are more than an hour old
  //really should be a function but I can't be bothered to fight
  //type script types to get things passed in correctly
  let nrOld = folsomFloor3.noiseReports;
  let nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  folsomFloor3.noiseReports = nrNew;

  nrOld = folsomFloor4.noiseReports;
  nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  folsomFloor4.noiseReports = nrNew;

  nrOld = bartonFloor1.noiseReports;
  nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  bartonFloor1.noiseReports = nrNew;

  nrOld = bartonFloor2.noiseReports;
  nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  bartonFloor2.noiseReports = nrNew;

  nrOld = bartonFloor3.noiseReports;
  nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  bartonFloor3.noiseReports = nrNew;

  nrOld = bartonFloor4.noiseReports;
  nrNew = [];
  for (let i = 0; i < nrOld.length; i++) {
    if (Date.now() - nrOld[i].timeReported < 3600000) {
      nrNew.push(nrOld[i]);
    }
  }
  bartonFloor4.noiseReports = nrNew;

  //setting rooms as closed when library is closed
  if (isClosed()) {
    for (const [roomNum, info] of Object.entries(folsomRooms)) {
      info.status = RoomStatusEnum.Closed;
      info.lastReported = Date.now();
      info.claimedUntil = undefined;
    }
    displayAsClosed = true;
  }
  //setting rooms to open when library opens back up 
  else if (displayAsClosed) {
    for (const [roomNum, info] of Object.entries(folsomRooms)) {
      info.status = RoomStatusEnum.Empty;
      info.lastReported = Date.now();
      info.claimedUntil = undefined;
    }
  }

  console.log("cleanup performed sucessfully!");
}

//main function for our back end, runs database cleanup and lets
//dev know which port the back end is listening on
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    dbCleanup();
    setInterval(dbCleanup, 60000);
    console.log("Listening on *:" + port);
  });
}

//api call for getting our building datastructure from the backend
app.get("/api/buildings", (req, res: Response<Buildings>, next) => {
  res.json(allBuildings);
});

//api call for reporting a room in a building as full
app.post(
  "/api/:building/reportAsFull/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    const room = allBuildings[req.params.building].rooms[req.params.roomNumber];
    //ensuring room exists
    if (!room) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      //setting room as full
      room.status = RoomStatusEnum.Full;
      room.lastReported = Date.now();
      room.claimedUntil = undefined;
      res.json(room);
    }
  }
);

//api call for reporting a room in a building as empty
app.post(
  "/api/:building/reportAsEmpty/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    const room = allBuildings[req.params.building].rooms[req.params.roomNumber];
    //ensuring room exists
    if (!room) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
        //setting room as empty
        room.status = RoomStatusEnum.Empty;
        room.lastReported = Date.now();
        room.claimedUntil = undefined;
        res.json(room);
    }
  }
);

//api call for setting room as in personal use
app.post(
  "/api/:building/reportAsPersonalUse/:roomNumber/:durationMins",
  (req, res: Response<Room | ErrorType>) => {
    const room = allBuildings[req.params.building].rooms[req.params.roomNumber];
    //checking number of minutes reported is calid
    if (isNaN(Number(req.params.durationMins))) {
      return res.status(400).json({
        status: 400,
        message: "Invalid duration.",
      });
    }
    //checking that room being reported exists
    if (!room) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      //setting room in personal use
      room.status = RoomStatusEnum.PersonalUse;
      room.lastReported = Date.now();
      room.claimedUntil =
      room.lastReported +
        Number(req.params.durationMins) * 60 * 1000;
      res.json(room);
    }
  }
);

//api call for reporting the noise level of a floor
app.post(
  "/api/:building/addNoiseReport/:floor/:noiseLevel",
  (req, res: Response<ErrorType | NoiseReport>) => {
    const floor = allBuildings[req.params.building].floors[req.params.floor];
    //checking the floor exists
    if (!floor) {
      res.status(404).json({
        status: 404,
        message: "Floor not found.",
      });
      return;
    }
    const noiseLevel = Number(req.params.noiseLevel);
    //checking the noise level being reported is a valid number
    if (isNaN(noiseLevel)) {
      res.status(404).json({
        status: 404,
        message: "Invalid noise level.",
      });
      return;
    }
    //creating a new noise report with the info from the api call
    const newNoiseReport: NoiseReport = {
      timeReported: Date.now(),
      noiseLevel,
    };
    //adding the noise report to the back end
    floor.noiseReports.push(newNoiseReport);
    res.json(newNoiseReport);
  }
);

export default app;
