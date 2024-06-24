import {type Express} from "express";

/* GET users listing. */
export default function setUsersRoutes(app: Express) {
  app.get('/api/users', function (req, res, next) {
    res.send(JSON.stringify({ "hello": "world" }))
  });
}
