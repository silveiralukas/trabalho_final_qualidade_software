import { UserModel } from "../../../models/user.model";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { UserRepository } from "../repositories/user.repository";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private repository: UserRepository,
    private cacheRepository: CacheRepository
  ) {}
  public async execute(data: CreateUserDTO) {
    const user = new UserModel(data.name, data.email, data.password);

    const result = await this.repository.create(user);

    await this.cacheRepository.delete("users");

    return result.toJson();
  }
}
