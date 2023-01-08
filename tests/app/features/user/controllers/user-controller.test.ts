import { openConnection } from "../../../util/open-connection";
import { closeConnection } from "../../../util/close-connection";
import { createServer } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { DatabaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { UserEntity } from "../../../../../src/app/shared/entities/users.entity";
import { TasksEntity } from "../../../../../src/app/shared/entities/tasks.entity";
import { UserModel } from "../../../../../src/app/models/user.model";
import { TasksModel } from "../../../../../src/app/models/tasks.model";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";

describe("Get user by id - integration controller test", () => {
  beforeAll(async () => await openConnection());
  afterAll(async () => await closeConnection());

  const makeSut = () => {
    const sut = createServer();
    return sut;
  };

  beforeEach(async () => {
    const manager = DatabaseConnection.connection.manager;

    await manager.clear(UserEntity);
  });

  const createUser = async () => {
    const user = new UserModel("Teste", "teste@teste.com", "12345");

    const userRepository = new UserRepository();
    await userRepository.create(user);

    return user;
  };

  test("deve retornar 404 se o usuário não existir", async () => {
    const app = makeSut();

    const result = await request(app).get("/users/abc").send();

    expect(result).not.toBeNull();
    expect(result.statusCode).toEqual(404);
    expect(result).toHaveProperty("body.ok", false);
  });

  test("deve retornar 200 se o usuário existir", async () => {
    const app = makeSut();

    const user = await createUser();

    const result = await request(app)
      .get("/users/" + user.id)
      .send();

    expect(result).not.toBeNull();
    expect(result.statusCode).toEqual(200);
    expect(result).toHaveProperty("body.ok", true);
  });
});
