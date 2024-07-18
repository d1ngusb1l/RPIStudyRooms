import express, {Request, Response, type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setUsersRouter from "./routes/users.js";
import prisma from "./db.js"
import { Room} from "@prisma/client"
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

app.get('/api/database', async(req, res: Response<Room[]>, next)=> {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});