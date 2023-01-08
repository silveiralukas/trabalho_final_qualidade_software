import { UserModel } from "../../../../../src/app/models/user.model";
import { TasksModel } from "../../../../../src/app/models/tasks.model";
import { openConnection } from "../../../util/open-connection";
import { closeConnection } from "../../../util/close-connection";
import { createServer } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { CreateTaskUseCase } from "../../../../../src/app/features/tasks/usecases/create-task.usecase";

describe("Task controller unit tests", () => {
  const user = new UserModel("any_name", "any_email", "password123");

  const note = new TasksModel("any_title", "any_description", user);

  beforeAll(async () => openConnection());
  afterAll(async () => closeConnection());
  afterEach(() => jest.clearAllMocks());

  const makeSut = () => {
    const sut = createServer();
    return sut;
  };

  test("deve retornar HTTP 404 se não for passado o title", async () => {
    const app = makeSut();

    const result = await request(app).post("/tasks/:idUser").send({});

    expect(result.statusCode).toBe(404);
  });

  test("deverá retornar HTTP 501 quando retornar exceção", async () => {
    const app = makeSut();

    jest
      .spyOn(CreateTaskUseCase.prototype, "execute")
      .mockImplementation(() => {
        throw new Error("unit test error");
      });

    const result = await request(app).post(`/tasks/${user.id}`).send({
      title: "any_title",
      description: "any_desc",
      idUser: user.id,
    });

    expect(result.statusCode).toBe(501);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty("body.ok");
  });

  /*test('should be able to return HTTP 404 if user is not correctly informed', async () => {
    const app = makeSut()

    const result = await request(app).get(`/notes/abc`).send(
      {
      title: 'any_title',
      description: 'any_desc',
      saveNote: true,
      idUser: user.id
      }
    );

    expect(result.statusCode).toEqual(404);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('body.ok', false);
  });

  test('should be able to return HTTP 201 when a note is successfully created', async () => {
    const app = makeSut();

    jest.spyOn(CreateNoteUseCase.prototype, 'execute').mockResolvedValue(
      new NotesModel(
        note.title,
        note.description,
        note.saveNote,
        user
      ).getNotes()
    )

    const result = await request(app).post(`/notes/${user.id}`)

    // ESSE ASSERT ESTÁ FALHANDO
    //expect(result.statusCode).toBe(201);
    expect(result.body).not.toBeNull();
    // ESSE ASSERT ESTÁ FALHANDO
    //expect(result).toHaveProperty('body.ok', true);

  });

  test('should be able to return HTTP 200 when a note successfully deleted', async () => {
    const app = makeSut();

    jest.spyOn(NoteRepository.prototype, 'get').mockResolvedValue(note)

    const result = await request(app).delete(`/notes/${user.id}/${note.user.id}`).send();

    expect(result.statusCode).toBe(200);
    expect(result.body).not.toBeNull();
    expect(result).toHaveProperty('body.ok', true);

  });

  test('should be able to return an HTTP 200 if the note is updated successfully', async () => {
    const app = makeSut();

    jest.spyOn(NoteRepository.prototype, 'get').mockResolvedValue(note);
    jest.spyOn(NoteRepository.prototype, 'editUser').mockResolvedValue(0);

    const result = await request(app).put(`/notes/${user.id}/${note.user.id}`).send({
      title: 'new_title',
      description: 'new_description'
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty('body.ok', true);
    expect(result.statusCode).toBe(200);
    expect(result.body).not.toBeNull();
    expect(result).toHaveProperty('body.mensagem', 'Note successfully updated!');

  });
  */
});
