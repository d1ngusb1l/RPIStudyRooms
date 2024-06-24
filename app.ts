import express, {type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setUsersRouter from "./routes/users";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static('./frontend/dist'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const routers: ((app: Express) => unknown)[] = [
  setUsersRouter,
]

for (const router of routers) {
  router(app);
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/dist/index.html"));
});

app.listen(5001, () => {
  console.log('Listening on *:' + 5001);
});