import express, {Request, Response, type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setUsersRouter from "./routes/users.js";
import { Type, type Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import cors from "cors";

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

const RoomDef = Type.Object({
  number: Type.String(),
  status: Type.String(),
  lastReported: Type.Date()
})
type Room = Static<typeof RoomDef>
const RoomArrayDef = Type.Array(RoomDef)

const initialRooms = [
  { number: "332-A", status: "empty", lastReported: new Date() },
  { number: "332-B", status: "empty", lastReported: new Date() },
  { number: "332-C", status: "empty", lastReported: new Date() },
  { number: "332-D", status: "empty", lastReported: new Date() },
  { number: "332-E", status: "empty", lastReported: new Date() },
  { number: "337-A", status: "empty", lastReported: new Date() },
  { number: "337-B", status: "empty", lastReported: new Date() },
  { number: "337-C", status: "empty", lastReported: new Date() },
  { number: "337-D", status: "empty", lastReported: new Date() },
  { number: "337-E", status: "empty", lastReported: new Date() },
  { number: "342-B", status: "empty", lastReported: new Date() },
  { number: "342-C", status: "empty", lastReported: new Date() },
  { number: "352-A", status: "empty", lastReported: new Date() },
  { number: "352-B", status: "empty", lastReported: new Date() },
  { number: "352-C", status: "empty", lastReported: new Date() },
  { number: "352-D", status: "empty", lastReported: new Date() },
  { number: "352-E", status: "empty", lastReported: new Date() },
  { number: "423-A", status: "empty", lastReported: new Date() },
  { number: "423-B", status: "empty", lastReported: new Date() },
  { number: "423-C", status: "empty", lastReported: new Date() },
  { number: "423-D", status: "empty", lastReported: new Date() },
  { number: "423-E", status: "empty", lastReported: new Date() },
  { number: "424-A", status: "empty", lastReported: new Date() },
  { number: "424-B", status: "empty", lastReported: new Date() },
  { number: "433-A", status: "empty", lastReported: new Date() },
  { number: "435-D", status: "empty", lastReported: new Date() },
  { number: "437-A", status: "empty", lastReported: new Date() },
  { number: "437-B", status: "empty", lastReported: new Date() },
  { number: "437-C", status: "empty", lastReported: new Date() },
  { number: "442-A", status: "empty", lastReported: new Date() },
  { number: "442-B", status: "empty", lastReported: new Date() },
  { number: "442-C", status: "empty", lastReported: new Date() },
  { number: "442-D", status: "empty", lastReported: new Date() },
  { number: "442-E", status: "empty", lastReported: new Date() },
  { number: "453-A", status: "empty", lastReported: new Date() },
  { number: "453-B", status: "empty", lastReported: new Date() },
  { number: "453-C", status: "empty", lastReported: new Date() },
  { number: "453-D", status: "empty", lastReported: new Date() },
  { number: "453-E", status: "empty", lastReported: new Date() },
];

app.get('/api/database', async(req, res: Response<Room[]>, next)=> {
  res.json(initialRooms);
});

app.get('/api/reportAsFull', async(req: Request, res)=> {
})

app.get('/api/reportAsEmpty', async(req: Request, res)=> {
})