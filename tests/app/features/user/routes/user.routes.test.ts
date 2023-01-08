import { createServer } from "../../../../../src/main/config/express.config";
import { openConnection } from "../../../util/open-connection";
import { closeConnection } from "../../../util/close-connection";
import request from "supertest";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";

const makeSut = (): Express.Application => {
  const sut = createServer();
  return sut;
};

describe("PUT - ", () => {
  beforeAll(async () => await openConnection());
  afterAll(async () => await closeConnection());

  test("deve retornar status 404 e mensagem 'Usuário não encontrado!' quando o id for inexistente", async () => {
    const app = makeSut();

    jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(null);
    const result = await request(app).put("/users/any_id").send({});

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual({
      ok: false,
      message: "Usuário não encontrado!",
    });
  });
});
