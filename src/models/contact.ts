import { DataTypes } from "sequelize";
import { db } from "../config/db";

export const Contact = db.define(
  "Contact",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    linkedId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Contact",
        key: "id",
      },
    },
    linkPrecedence: {
      type: DataTypes.ENUM("primary", "secondary"),
      allowNull: false,
    },
    // createdAt and updatedAt are handled by sequelize on its own using DATE datatype -- Works
    deleteAt: {
      type: DataTypes.DATE,
    },
  },
  {
    // Other model options go here
  }
);

Contact.hasOne(Contact, { foreignKey: "linkedId" });
