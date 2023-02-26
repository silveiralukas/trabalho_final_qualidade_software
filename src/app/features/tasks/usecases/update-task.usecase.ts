import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { TasksRepository } from "../repositories/tasks.repository";

interface UpdateTaskDTO {
  taskId: string;
  title?: string;
  description?: string;
}

export class UpdateTaskUseCase {
  constructor(
    private repository: TasksRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(data: UpdateTaskDTO) {
    const task = await this.repository.getById(data.taskId);

    if (!task) {
      return null;
    }

    task.title = data.title ?? task.title;
    task.description = data.description ?? task.description;

    const result = await this.repository.update(task);

    await this.cacheRepository.delete(`task-${task.id}`);
    await this.cacheRepository.delete("tasks");

    return result;
  }
}
