import {type Express} from "express";
import prisma from "../prismaDb.js";

/* GET users listing. */
export default function setUsersRoutes(app: Express) {
  app.get('/api/users', async function (req, res, next) {
    const users = await prisma.user.findMany();
    res.json(users);
  });
}
