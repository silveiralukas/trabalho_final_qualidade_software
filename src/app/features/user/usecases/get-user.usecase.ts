import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../repositories/user.repository";

export class GetUserUseCase {
  constructor(
    private repository: UserRepository,
    private cacheRepository: CacheRepository
  ) {}

  public async execute(id: string) {
    // 1 - verifica se user está em cache
    const userCache = await this.cacheRepository.get(`user-${id}`);

    // 2 - se tiver, retorna cache
    if (userCache) {
      return userCache;
    }

    // 3 - se não, busca user do repositorio primario
    const user = await this.repository.get(id);

    if (!user) {
      return null;
    }

    const userJson = user.toJson();

    // 4 - entao seta o user no cache
    await this.cacheRepository.set(`user-${id}`, userJson);

    // 5 - e retorna ele.

    return userJson;
  }
}
