export default (sequelize, DataTypes) => {
  const MyPingsPost = sequelize.define(
    "MyPingsPost",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      mypings: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        primaryKey: true,
      },
      post: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        primaryKey: true,
      },
    },
    {
      modelName: "MyPingsPost",
      tableName: "MYPINGSPOST",
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );

  return MyPingsPost;
};
