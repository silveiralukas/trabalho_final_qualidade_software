import { openConnection } from "../../../util/open-connection";
import { closeConnection } from "../../../util/close-connection";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { CreateUserUseCase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { UserModel } from "../../../../../src/app/models/user.model";

describe("Create user usecase unit tests", () => {
  beforeAll(async () => {
    await openConnection();
  });

  afterAll(async () => {
    await closeConnection();
  });

  beforeEach(() => {
    jest.restoreAllMocks();

    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);
  });

  const makeSut = () => {
    const sut = new CreateUserUseCase(
      new UserRepository(),
      new CacheRepository()
    );

    return sut;
  };

  test("deve retornar os dados de um novo user ao executar o create com sucesso", async () => {
    const sut = makeSut();

    const user = {
      name: "José",
      email: "jose@teste.com",
      password: "123456jgf",
    };

    jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue(new UserModel(user.name, user.email, user.password));

    jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

    const result = await sut.execute(user);

    expect(result).not.toBeNull();
    expect(result).toBeDefined();
    expect(result).toHaveProperty("name", user.name);
    expect(result).toHaveProperty("email", user.email);
    expect(result).toHaveProperty("password", user.password);
  });
});
