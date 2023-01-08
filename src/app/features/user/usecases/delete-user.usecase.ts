import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../repositories/user.repository";

interface DeleteUserDTO {
  id: string;
}

export class DeleteUserUseCase {
  constructor(
    private repository: UserRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(data: DeleteUserDTO) {
    const user = await this.repository.get(data.id);

    if (!user) {
      return null;
    }

    //const result = await this.repository.delete(data.id);
    await this.repository.delete(data.id);

    await this.cacheRepository.delete(`user-${data.id}`);
    await this.cacheRepository.delete("users");

    //return result;
  }
}
