import { createServer } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { openConnection } from "../../../util/open-connection";
import { closeConnection } from "../../../util/close-connection";
import { CreateUserUseCase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { UserModel } from "../../../../../src/app/models/user.model";

describe("User controller tests", () => {
  beforeAll(async () => await openConnection());
  afterAll(async () => await closeConnection());

  const makeSut = () => {
    const sut = createServer();
    return sut;
  };

  test("deve retornar HTTP 500 quando o name não for informado", async () => {
    const app = makeSut();

    const result = await request(app).post("/users").send({});

    expect(result.statusCode).toBe(500);
  });

  test("deve retornar HTTP 201 quando o user for criado com sucesso", async () => {
    const app = makeSut();

    const user = {
      name: "teste",
      email: "teste@teste.com",
      password: "1234",
    };

    jest
      .spyOn(CreateUserUseCase.prototype, "execute")
      .mockResolvedValue(
        new UserModel(user.name, user.email, user.password).toJson()
      );

    const result = await request(app).post("/users").send(user);

    expect(result.statusCode).toBe(201);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", true);
    expect(result.body).toHaveProperty(
      "message",
      "Usuário criado com sucesso!"
    );
    expect(result.body).toHaveProperty("data");
  });

  test("deve retornar HTTP 500 quando o usecase gerar excecao", async () => {
    const app = makeSut();

    const user = {
      name: "abc",
      email: "abc@teste.com",
      password: "12345abc",
    };

    jest
      .spyOn(CreateUserUseCase.prototype, "execute")
      .mockImplementation(() => {
        throw new Error("Erro no teste unitario");
      });

    const result = await request(app).post("/users").send(user);

    expect(result.statusCode).toBe(500);
    expect(result.body).not.toBeNull();
    expect(result.body).toHaveProperty("ok", false);
    expect(result.body).toHaveProperty(
      "message",
      new Error("Erro no teste unitario").toString()
    );
  });
});
