import { DataSource } from "typeorm";
import "dotenv/config";
import { appEnv } from "../../app/envs/app.env";

let dataSource = new DataSource({
  type: "postgres",
  url: appEnv.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  entities: ["src/app/shared/entities/**/*.ts"],
  migrations: ["src/app/shared/migrations/**/*.ts"],
  schema: "trabalho_final",
});

if (process.env.NODE_ENV === "test") {
  dataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite3",
    synchronize: false,
    entities: ["src/app/shared/entities/**/*.ts"],
    migrations: ["tests/app/shared/migrations/**/*.ts"],
  });
}

export default dataSource;
