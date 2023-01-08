import { NextFunction, Request, Response } from "express";

export const createTaskValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).send({
      ok: false,
      message: "Title not provided",
    });
  }

  if (!description) {
    return res.status(400).send({
      ok: false,
      message: "Description not provided",
    });
  }

  if (!userId) {
    return res.status(400).send({
      ok: false,
      message: "User is not found",
    });
  }

  next();
};
