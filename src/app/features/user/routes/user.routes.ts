import { Request, Router, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { createUserValidator } from "../validators/create-user.validator";

const userRoutes = Router();

userRoutes.get("/", new UserController().list);

userRoutes.get("/:id", new UserController().get);

userRoutes.post("/", new UserController().createUser);

userRoutes.post("/login", new UserController().login);

userRoutes.put("/:id", new UserController().update);

userRoutes.delete("/:id", new UserController().delete);

export { userRoutes };
