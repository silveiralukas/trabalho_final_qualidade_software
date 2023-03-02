import { Request, Response, Router } from "express";
import { TasksController } from "../controllers/tasks.controller";

const tasksRoutes = Router({
  mergeParams: true,
});

//---------------TasksRoutes--------------

tasksRoutes.get("/", new TasksController().listTask);

tasksRoutes.get("/:id", new TasksController().getById);

tasksRoutes.post("/:userId", new TasksController().createTask);

tasksRoutes.put("/:taskId", new TasksController().updateTask);

tasksRoutes.delete("/:taskId", new TasksController().deleteTask);

export { tasksRoutes };
