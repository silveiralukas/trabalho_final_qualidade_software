import { Request, Response } from "express";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { serverError, success } from "../../../shared/util/response.helper";
import { UserRepository } from "../../user/repositories/user.repository";
import { TasksRepository } from "../repositories/tasks.repository";
import { CreateTaskUseCase } from "../usecases/create-task.usecase";
import { GetTaskUseCase } from "../usecases/get-tasks.usecase";
import { ListTasksUseCase } from "../usecases/list-tasks.usecase";
import { UpdateTaskUseCase } from "../usecases/update-task.usecase";

export class TasksController {
  public async listTask(req: Request, res: Response) {
    try {
      const usecase = new ListTasksUseCase(
        new TasksRepository(),
        new CacheRepository()
      );

      const result = await usecase.execute();

      if (!result) {
        return null;
      }

      return success(res, result);
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const usecase = new GetTaskUseCase(
        new TasksRepository(),
        new CacheRepository()
      );

      const result = await usecase.execute(userId);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Task não encontrada!",
        });
      }

      return success(res, result, "Tasks obtidas com sucesso!");
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public async updateTask(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { title, description } = req.body;

      const usecase = new UpdateTaskUseCase(
        new TasksRepository(),
        new CacheRepository()
      );
      const result = await usecase.execute({
        taskId,
        title,
        description,
      });

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Tarefa não encontrada!",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Tarefa atualizada com sucesso",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: "Instabilidade no servidor!",
        error: error.toString(),
      });
    }
  }

  public async createTask(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, description } = req.body;

      const usecase = new CreateTaskUseCase(
        new TasksRepository(),
        new CacheRepository()
      );

      const result = await usecase.execute({
        title,
        description,
        userId,
      });

      return res.status(201).send({
        ok: true,
        message: "Tarefa criada com sucesso",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: "Instabilidade no servidor!",
        error: error.toString(),
      });
    }
  }

  public async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const repository = new TasksRepository();
      const result = await repository.delete(id);

      return res.status(200).send({
        ok: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: "Instabilidade no servidor!",
        error: error.toString(),
      });
    }
  }
}
