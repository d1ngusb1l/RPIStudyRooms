import express, {Request, Response, type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setUsersRouter from "./routes/users.js";
import { Type, type Static } from '@sinclair/typebox'
import cors from "cors";
import { ErrorType, Rooms, Room, RoomStatusEnum } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectBase = path.resolve(__dirname, "../");
const frontendBase = path.join(projectBase, "frontend");
const frontendDistBase = path.join(frontendBase, "dist");

const app = express();
app.use(express.static(frontendDistBase));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || undefined
}))

const routers: ((app: Express) => unknown)[] = [
  setUsersRouter,
]

for (const router of routers) {
  router(app);
}

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistBase, "index.html"));
  });
}

const port = Number(process.env.PORT) || 5001;

app.listen(port, () => {
  //accessDBTest();
  console.log('Listening on *:' + port);
});

const initialRooms: Rooms = {
  "332-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "332-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "332-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "332-D": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "332-E": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "337-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "337-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "337-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "337-D": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "337-E": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "342-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "342-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "352-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "352-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "352-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "352-D": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "352-E": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "423-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "423-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "423-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "423-D": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "423-E": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "424-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "424-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "433-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "435-D": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "437-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "437-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "437-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "442-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "442-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "442-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "442-D": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "442-E": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "453-A": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "453-B": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "453-C": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "453-D": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  },
  "453-E": {
      "status": RoomStatusEnum.Empty,
      "lastReported": 0
  }
};

const floor3 = {
  floorNum: 300,
  noiseReports: [{timeReported: 0, noiseLevel: 0}],
  rooms: ["332-A", "332-B", "332-C", "332-D", "332-E", 
    "337-A", "337-B", "337-C", "337-D", "337-D", "342-B",
    "342-C", "352-A", "352-B", "352-C", "352-D", "352-E"]
}

const floor4 = {
  floorNum: 400,
  noiseReports: [{timeReported: 0, noiseLevel: 0}],
  rooms: ["423-A", "423-B", "423-C", "423-D", "423-E",
    "424-A", "424-B", "433-A", "435-D", "437-A", "437-B",
    "437-C", "442-A", "442-B", "442-C", "442-D", "442-E",
    "453-A", "453-B", "453-C", "453-D", "453-E"]
}

app.get('/api/database', async(req, res: Response<Rooms>, next)=> {
  res.json(initialRooms);
});

app.get('/api/reportAsFull/:roomNumber', async(req, res: Response<Room | ErrorType>)=> {
  if (!initialRooms[req.params.roomNumber]) {
    res.status(404).json({
      status: 404,
      message: "Room not found."
    });
    return;
  } else {
    initialRooms[req.params.roomNumber].status = RoomStatusEnum.Full;
    initialRooms[req.params.roomNumber].lastReported = Date.now();
    res.json(initialRooms[req.params.roomNumber]);
  
  }
})

app.get('/api/reportAsEmpty/:roomNumber', async(req, res: Response<Room | ErrorType>)=> {
  if (!initialRooms[req.params.roomNumber]) {
    res.status(404).json({
      status: 404,
      message: "Room not found."
    });
    return;
  } else {
    initialRooms[req.params.roomNumber].status = RoomStatusEnum.Empty;
    initialRooms[req.params.roomNumber].lastReported = Date.now();
    res.json(initialRooms[req.params.roomNumber]);
  }
})
  