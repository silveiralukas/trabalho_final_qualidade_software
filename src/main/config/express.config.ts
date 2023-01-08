import cors from "cors";
import express from "express";
import { tasksRoutes } from "../../app/features/tasks/routes/tasks.routes";
import { userRoutes } from "../../app/features/user/routes/user.routes";

export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/users", userRoutes);
  app.use("/tasks", tasksRoutes);

  return app;
};
