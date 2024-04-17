import { Sequelize } from "sequelize";
import { createUserModel } from "../model/userSchema.js";
import { createUserAuthModel } from "../model/userinfoSchema.js";

const sequelize = new Sequelize("my_database", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});
let userModel = null;
let userInfoModel = null;

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    userModel = await createUserModel(sequelize);
    userInfoModel = await createUserAuthModel(sequelize);

    console.log("database synced....");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connection, userModel, userInfoModel };
