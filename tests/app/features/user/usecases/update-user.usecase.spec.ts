import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { UpdateUserUseCase } from "../../../../../src/app/features/user/usecases/update-user.usecase";
import { UserModel } from "../../../../../src/app/models/user.model";
import { openConnection } from "../../../../../tests/app/util/open-connection";
import { closeConnection } from "../../../../../tests/app/util/close-connection";

interface SutTypes {
  repository: UserRepository;
  cacheRepository: CacheRepository;
  sut: UpdateUserUseCase;
}

const makeSut = (): SutTypes => {
  const repository = new UserRepository();
  const cacheRepository = new CacheRepository();
  const sut = new UpdateUserUseCase(repository, cacheRepository);
  return {
    repository,
    cacheRepository,
    sut,
  };
};

describe("UpdateUserUseCase -", () => {
  const userModel = new UserModel("any_name", "any_email@teste.com", "2656");

  beforeAll(async () => await openConnection());
  afterEach(() => jest.clearAllMocks());
  afterAll(async () => await closeConnection());

  test("deve retornar null quando o método get do repository retornar null, significando que não foi encontrado nenhum usuário com aquele id", async () => {
    const { repository, sut } = makeSut();

    jest.spyOn(repository, "get").mockResolvedValue(null);

    const result = await sut.execute({
      id: "any_id",
    });

    expect(result).toBe(null);
  });

  test("deve retornar uma instância de user e chamar o método update do repository", async () => {
    const { repository, cacheRepository, sut } = makeSut();

    jest.spyOn(repository, "get").mockResolvedValue(userModel);

    jest.spyOn(repository, "update").mockResolvedValue(0);

    jest.spyOn(cacheRepository, "delete").mockResolvedValue();

    const observer = jest.spyOn(repository, "update");

    const observer2 = jest.spyOn(cacheRepository, "delete");

    const result = await sut.execute({
      id: "any_id",
      email: "new_email_to_update",
      password: "new_password_to_update",
    });

    userModel.email = "new_email_to_update";
    userModel.password = "new_password_to_update";

    expect(result).toBe(0);
    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenCalledWith(userModel);
    expect(observer2).toBeCalledWith(`user-${userModel.id}`);
    expect(observer2).toBeCalledWith("users");
  });

  test("o caso de uso deve continuar lançando um erro quando algum dos métodos dos repositórios lançarem", async () => {
    const { sut, repository } = makeSut();
    const error = new Error();

    jest.spyOn(repository, "get").mockRejectedValue(error);

    const result = sut.execute({ id: "any_id" });

    await expect(result).rejects.toThrow(error);
  });
});
