export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.TINYINT,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      cate_name: {
        type: DataTypes.STRING(30),
      },
    },
    {
      modelName: "Category",
      tableName: "CATEGRORY",
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );

  Category.associate = (db) => {
    db.Category.hasMany(db.MyPings, { foreignKey: "category" });
  };

  return Category;
};
