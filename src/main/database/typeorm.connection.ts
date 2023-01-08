import { DataSource } from "typeorm";
import "dotenv/config";
import typeormConfig from "../config/typeorm.config";

export class DatabaseConnection {
  private static _connection: DataSource;

  public static async connect() {
    if (!this._connection) {
      this._connection = await typeormConfig.initialize();
    }

    console.log("Database inicializada.");
  }

  public static get connection() {
    if (!this._connection) {
      throw new Error("Database não inicializada");
    }

    return this._connection;
  }
}
