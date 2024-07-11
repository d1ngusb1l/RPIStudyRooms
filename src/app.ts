import express, {type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import setUsersRouter from "./routes/users.js";

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

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
  });
}

const port = Number(process.env.PORT) || 5001;

app.listen(port, () => {
  console.log('Listening on *:' + port);
});