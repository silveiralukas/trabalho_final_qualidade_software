import { UserEntity } from "../../../shared/entities/users.entity";
import { UserModel } from "../../../models/user.model";
import { DatabaseConnection } from "../../../../main/database/typeorm.connection";

interface UpdateUserDTO {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

export class UserRepository {
  private _repository = DatabaseConnection.connection.getRepository(UserEntity);

  public async list() {
    const result = await this._repository.find();

    const users = result.map((item) => {
      return this.mapEntityToModel(item);
    });

    return users;
  }

  private mapEntityToModel(item: UserEntity) {
    const user = UserModel.create(
      item.name,
      item.email,
      item.password,
      item.id
    );

    return user;
  }

  public async get(id: string) {
    const result = await this._repository.findOneBy({
      id,
    });
    if (!result) {
      return null;
    }

    return this.mapEntityToModel(result);
  }

  public async create(user: UserModel) {
    const userEntity = this._repository.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const result = await this._repository.save(userEntity);

    return this.mapEntityToModel(result);
  }

  public async update(user: UpdateUserDTO) {
    const result = await this._repository.update(
      {
        id: user.id,
      },
      {
        name: user.name,
        email: user.email,
        password: user.password,
      }
    );

    return result.affected ?? 0;
  }

  public async delete(id: string) {
    /* const result = await this._repository.delete(id);

    if(!result) {
      return null;
    }
 */

    return await this._repository.delete(id);
  }

  public async login(email: string, password: string) {
    const result = await this._repository.findOneBy({ email, password });

    return result;
  }
}
