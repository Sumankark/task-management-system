import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTask,
  updateTask,
} from "../controller/taskController.js";

const taskRouter = Router();

taskRouter
  .route("/")
  .post(isAuthenticated, createTask)
  .get(isAuthenticated, getAllTask);

taskRouter
  .route("/:id")
  .get(isAuthenticated, getTask)
  .patch(isAuthenticated, updateTask)
  .delete(isAuthenticated, deleteTask);

export default taskRouter;
