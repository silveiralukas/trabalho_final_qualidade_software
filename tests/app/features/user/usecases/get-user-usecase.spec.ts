import { CacheRepository } from "../../../../../src/app/shared/repositories/cache.repository";
import { closeConnection } from "../../../util/close-connection";
import { openConnection } from "../../../util/open-connection";
import { GetUserUseCase } from "../../../../../src/app/features/user/usecases/get-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserModel } from "../../../../../src/app/models/user.model";

describe("Get user usecase tests", () => {
  beforeAll(async () => {
    await openConnection();
  });

  afterAll(async () => {
    await closeConnection();
  });

  const makeSut = () => {
    const sut = new GetUserUseCase(new UserRepository(), new CacheRepository());

    return sut;
  };

  test("deve retornar um user valido se o id existir", async () => {
    const sut = makeSut();

    const user = new UserModel("abc", "abc@teste.com", "1234");
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(user);
    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);

    const result = await sut.execute(user.id);

    expect(result).not.toBeNull();
    expect(result.id).toBe(user.id);
  });

  test("deve retornar null quando o user não existe", async () => {
    const sut = makeSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(null);
    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);

    const result = await sut.execute("id-qualquer");

    expect(result).toBeNull();
  });

  test("deve retornar um user caso esteja em cache", async () => {
    const sut = makeSut();

    const user = new UserModel("nome-teste", "nome@teste.com", "1234");
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue(user.toJson());

    const result = await sut.execute(user.id);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("id");
    expect(result.id).toBe(user.id);
  });
});
