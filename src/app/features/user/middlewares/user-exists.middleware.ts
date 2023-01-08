import { NextFunction, Request, Response } from "express";
import { userList } from "../../../shared/data/users.list";

export const userValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const userName = userList.some((user) => user.email === email);

  if (userName) {
    return res.status(400).send({
      ok: false,
      message: "Este Email já existe!",
    });
  }
  next();
};
