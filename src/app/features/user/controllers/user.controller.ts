import { Request, Response } from "express";
import { userList } from "../../../shared/data/users.list";
import { UserModel } from "../../../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { ListUsersUseCase } from "../usecases/list-users.usecase";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { CreateUserUseCase } from "../usecases/create-user.usecase";
import { GetUserUseCase } from "../usecases/get-user.usecase";
import { serverError, success } from "../../../shared/util/response.helper";
import { UpdateUserUseCase } from "../usecases/update-user.usecase";
import { DeleteUserUseCase } from "../usecases/delete-user.usecase";
import { LoginUserUseCase } from "../usecases/login-user.usecase";

export class UserController {
  public async list(req: Request, res: Response) {
    try {
      const usecase = new ListUsersUseCase(
        new UserRepository(),
        new CacheRepository()
      );
      const result = await usecase.execute();

      return res.status(200).send({
        ok: true,
        message: "Listando todos os usuários!",
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

  public async login(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, password } = req.body;

      const usecase = new LoginUserUseCase(
        new UserRepository(),
        new CacheRepository()
      );

      const result = await usecase.execute(id, email, password);

      return success(res, result, "Usuário logado!");
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usecase = new GetUserUseCase(
        new UserRepository(),
        new CacheRepository()
      );

      const result = await usecase.execute(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Usuário não encontrado!",
        });
      }

      return success(res, result, "Usuário obtido com sucesso!");
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const usecase = new CreateUserUseCase(
        new UserRepository(),
        new CacheRepository()
      );
      const result = await usecase.execute({
        name,
        email,
        password,
      });

      return res.status(201).send({
        ok: true,
        message: "Usuário criado com sucesso!",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, password } = req.body;

      const usecase = new UpdateUserUseCase(
        new UserRepository(),
        new CacheRepository()
      );

      const result = await usecase.execute({
        id,
        email,
        password,
      });

      if (result == null) {
        return res.status(404).send({
          ok: false,
          message: "Usuário não encontrado!",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Usuário atualizado com sucesso!",
        data: result,
      });
    } catch (error: any) {
      return serverError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usecase = new DeleteUserUseCase(
        new UserRepository(),
        new CacheRepository()
      );

      const result = await usecase.execute({ id });

      return success(res, result, "Usuário deletado com sucesso!");
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
