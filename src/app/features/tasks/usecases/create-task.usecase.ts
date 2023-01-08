import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { TasksRepository } from "../repositories/tasks.repository";

export interface CreateTaskDTO {
  title: string;
  description: string;
  userId: string;
}

export class CreateTaskUseCase {
  constructor(
    private repository: TasksRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(data: CreateTaskDTO) {
    const result = await this.repository.create(data);

    await this.cacheRepository.delete("tasks");

    return result.toJson();
  }
}
