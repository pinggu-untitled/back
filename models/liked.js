export default (sequelize, DataTypes) => {
  const Liked = sequelize.define(
    "Liked",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        foreignKey: true,
      },
      post: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        foreignKey: true,
      },
    },
    {
      modelName: "Liked",
      tableName: "LIKED",
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );

  return Liked;
};
