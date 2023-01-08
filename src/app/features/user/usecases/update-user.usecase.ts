import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../repositories/user.repository";

interface UpdateUserDTO {
  id: string;
  email?: string;
  password?: string;
}

export class UpdateUserUseCase {
  constructor(
    private repository: UserRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(data: UpdateUserDTO) {
    const user = await this.repository.get(data.id);

    if (!user) {
      return null;
    }

    user.email = data.email ?? user.email;
    user.password = data.password ?? user.password;

    const result = await this.repository.update(user);

    await this.cacheRepository.delete(`user-${user.id}`);
    await this.cacheRepository.delete("users");

    return result;
  }
}
