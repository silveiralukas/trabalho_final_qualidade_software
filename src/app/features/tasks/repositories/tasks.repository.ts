import { randomUUID } from "crypto";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { TasksModel } from "../../../models/tasks.model";
import { UserModel } from "../../../models/user.model";
import { TasksEntity } from "../../../shared/entities/tasks.entity";
import { UserRepository } from "../../user/repositories/user.repository";
import { CreateTaskDTO } from "../usecases/create-task.usecase";

interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string;
}

export class TasksRepository {
  private _repository =
    DatabaseConnection.connection.getRepository(TasksEntity);

  public async list(id: string) {
    const result = await this._repository.find({
      relations: ["users"],
    });

    const tasks = result.map((item) => {
      return this.mapEntityToModel(item);
    });

    return tasks;
  }

  public async getById(id: string) {
    const result = await this._repository.findOneBy({
      id,
    });

    if (!result) {
      return null;
    }

    return this.mapEntityToModel(result);
  }

  public async create(taskDTO: CreateTaskDTO): Promise<TasksModel> {
    const userRepository = new UserRepository();
    const user = await userRepository.get(taskDTO.userId);

    if (!user) {
      throw new Error("User is not found!");
    }

    const taskEntity = this._repository.create({
      id: randomUUID(),
      title: taskDTO.title,
      description: taskDTO.description,
      idUser: taskDTO.userId,
    });

    await this._repository.save(taskEntity);

    return this.mapEntityToModel(taskEntity, user);
  }

  public async update(task: UpdateTaskDTO) {
    const result = await this._repository.update(
      {
        id: task.id,
      },
      {
        title: task.title,
        description: task.description,
      }
    );

    return result.affected ?? 0;
  }

  public async delete(id: string) {
    return await this._repository.delete({
      id,
    });
  }

  private mapEntityToModel(taskEntity: TasksEntity, userModel?: UserModel) {
    const user =
      userModel ??
      UserModel.create(
        taskEntity.users.name,
        taskEntity.users.email,
        taskEntity.users.password,
        taskEntity.users.id
      );

    return TasksModel.create(
      taskEntity.id,
      taskEntity.title,
      taskEntity.description,
      user
    );
  }
}
