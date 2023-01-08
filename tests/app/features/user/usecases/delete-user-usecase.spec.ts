import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { UserModel } from "../../../../../src/app/models/user.model";
import { DeleteUserUseCase } from "../../../../../src/app/features/user/usecases/delete-user.usecase";
import { openConnection } from "../../../../../tests/app/util/open-connection";
import { closeConnection } from "../../../../../tests/app/util/close-connection";

interface SutTypes {
  repository: UserRepository;
  cacheRepository: CacheRepository;
  sut: DeleteUserUseCase;
}

const makeSut = (): SutTypes => {
  const repository = new UserRepository();
  const cacheRepository = new CacheRepository();
  const sut = new DeleteUserUseCase(repository, cacheRepository);
  return {
    repository,
    cacheRepository,
    sut,
  };
};

describe("DeleteUserUseCase -", () => {
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

  test("deve retornar uma instância de user e chamar o método delete do repository", async () => {
    const { repository, cacheRepository, sut } = makeSut();

    const user = new UserModel("teste_nome", "teste_email", "teste123");

    jest.spyOn(repository, "get").mockResolvedValue(user);

    jest.spyOn(cacheRepository, "delete").mockResolvedValue();

    const observer = jest.spyOn(repository, "delete");

    const observer2 = jest.spyOn(cacheRepository, "delete");

    const result = await sut.execute({
      id: user.id,
    });

    expect(result).toBe(undefined);
    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenCalledWith(user.id);
    expect(observer2).toBeCalledWith(`user-${user.id}`);
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
