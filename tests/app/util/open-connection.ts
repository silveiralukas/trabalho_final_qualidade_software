import { DatabaseConnection } from "../../../src/main/database/typeorm.connection";
import { CacheConnection } from "../../../src/main/database/cache.connection";

export const openConnection = async () => {
  await DatabaseConnection.connect();
  await CacheConnection.connect();
};
