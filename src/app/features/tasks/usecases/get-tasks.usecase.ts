import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { TasksRepository } from "../repositories/tasks.repository";

export class GetTaskUseCase {
  constructor(
    private repository: TasksRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(id: string) {
    // 1 - verifica se task está em cache
    const taskCache = await this.cacheRepository.get(`task-${id}`);

    // 2 - se tiver, retorna cache
    if (taskCache) {
      return taskCache;
    }

    // 3 - se não, busca user do repositorio primario
    const task = await this.repository.getById(id);

    if (!task) {
      return null;
    }

    const taskJson = task.toJson();

    // 4 - entao seta a task no cache
    await this.cacheRepository.set(`task-${id}`, taskJson);

    // 5 - e retorna ele.

    return taskJson;
  }
}
