import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
// import StudentsController from "./app/controllers/StudentsController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

// routes.post("/students-create", StudentsController.store);
routes.post("/users-create", UserController.store);

routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

export default routes;
