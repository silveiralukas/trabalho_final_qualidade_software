import { DatabaseConnection } from "../../../src/main/database/typeorm.connection";
import { CacheConnection } from "../../../src/main/database/cache.connection";

export const closeConnection = async () => {
  await DatabaseConnection.connection.destroy();
  await CacheConnection.connection.quit();
};
