import { Sequelize } from "sequelize";
import config from ".";

export const db = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: "localhost",
    dialect: "postgres",
    define: {
      // freeze to stop auto-pluralizing of the Table names eg, User -> Users
      freezeTableName: true,
    },
  }
);
