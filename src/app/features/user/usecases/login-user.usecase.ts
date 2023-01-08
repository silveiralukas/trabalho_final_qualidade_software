import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../repositories/user.repository";

export class LoginUserUseCase {
  constructor(
    private repository: UserRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(id: string, email: string, password: string) {
    const userCache = await this.cacheRepository.get(`user-${id}`);

    if (userCache) {
      return userCache;
    }

    const result = await this.repository.login(email, password);

    return result;
  }
}
