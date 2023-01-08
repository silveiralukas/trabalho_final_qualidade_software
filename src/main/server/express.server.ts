import { appEnv } from "../../app/envs/app.env";
import { userRoutes } from "../../app/features/user/routes/user.routes";
import { createServer } from "../config/express.config";

export const runServer = () => {
  const app = createServer();

  /*  app.use("/list", userRoutes);
  app.use("/create", userRoutes);
  app.use("/:id", userRoutes);
  app.use("/login", userRoutes); */

  //app.use("/tasks/:userId", tasksRoutes);

  app.listen(appEnv.port, () => {
    console.log("API rodando...");
  });
};
