import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { TasksRepository } from "../repositories/tasks.repository";

interface DeleteTaskDTO {
  taskId: string;
}

export class DeleteTaskUseCase {
  constructor(
    private repository: TasksRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(data: DeleteTaskDTO) {
    const task = await this.repository.getById(data.taskId);

    if (!task) {
      return null;
    }

    await this.repository.delete(data.taskId);
    await this.cacheRepository.delete(`task-${data.taskId}`);
    await this.cacheRepository.delete("tasks");
  }
}
