import express, { Request, Response, type Express } from "express";
import dotenv from "dotenv";
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
} from "./types.js";
import { floors, initialRooms } from "./db.js";

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

app.listen(port, () => {
  //accessDBTest();
  console.log("Listening on *:" + port);
});

app.get("/api/database", (req, res: Response<Rooms>, next) => {
  res.json(initialRooms);
});

app.post(
  "/api/reportAsFull/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    if (!initialRooms[req.params.roomNumber]) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      initialRooms[req.params.roomNumber].status = RoomStatusEnum.Full;
      initialRooms[req.params.roomNumber].lastReported = Date.now();
      res.json(initialRooms[req.params.roomNumber]);
    }
  }
);

app.post(
  "/api/reportAsEmpty/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    if (!initialRooms[req.params.roomNumber]) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      initialRooms[req.params.roomNumber].status = RoomStatusEnum.Empty;
      initialRooms[req.params.roomNumber].lastReported = Date.now();
      res.json(initialRooms[req.params.roomNumber]);
    }
  }
);

app.post(
  "/api/reportAsEmpty/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    if (!initialRooms[req.params.roomNumber]) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      initialRooms[req.params.roomNumber].status = RoomStatusEnum.Empty;
      initialRooms[req.params.roomNumber].lastReported = Date.now();
      res.json(initialRooms[req.params.roomNumber]);
    }
  }
);

app.post(
  "/api/reportAsPersonalUse/:roomNumber",
  (req, res: Response<Room | ErrorType>) => {
    if (!initialRooms[req.params.roomNumber]) {
      res.status(404).json({
        status: 404,
        message: "Room not found.",
      });
      return;
    } else {
      initialRooms[req.params.roomNumber].status = RoomStatusEnum.PersonalUse;
      initialRooms[req.params.roomNumber].lastReported = Date.now();
      res.json(initialRooms[req.params.roomNumber]);
    }
  }
);

app.get("/api/floors", (req, res: Response<Floors>) => {
  res.json(floors);
});

app.post(
  "/api/addNoiseReport/:floor/:noiseLevel",
  (req, res: Response<ErrorType | NoiseReport>) => {
    const floor = floors[req.params.floor];
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
