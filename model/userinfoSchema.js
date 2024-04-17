// 1. Define Sequelize Model
import { DataTypes } from "sequelize";

export const createUserAuthModel = async (sequelize) => {
  const User = sequelize.define("UserInfos", {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return User;
};
