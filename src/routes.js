import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import StudentsController from "./app/controllers/StudentsController";
import PlanController from "./app/controllers/PlanController";
import EnrollmentController from "./app/controllers/EnrollmentController";
import CheckinController from "./app/controllers/CheckinController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post("/users-create", UserController.store);

routes.post("/students-create", StudentsController.store);

routes.get("/students", StudentsController.index);

routes.put("/students/:id", StudentsController.update);

routes.post("/students/:id/checkins", CheckinController.store);

routes.get("/students/:id/checkins", CheckinController.index);

routes.post("/plans", PlanController.store);

routes.get("/plans", PlanController.index);

routes.put("/plans/:id", PlanController.update);

routes.delete("/plans/:id", PlanController.delete);

routes.post("/enrollments", EnrollmentController.store);

routes.get("/enrollments", EnrollmentController.index);

routes.put(
  "/enrollments/:enrollmentId/:studentId",
  EnrollmentController.update
);

routes.delete("/enrollments/:enrollmentId", EnrollmentController.delete);

routes.put("/users", UserController.update);

export default routes;
