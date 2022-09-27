export default (sequelize, DataTypes) => {
  const MyPings = sequelize.define(
    "MyPings",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      is_private: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      modelName: "MyPings",
      tableName: "MYPINGS",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      paranoid: false,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      sequelize,
    }
  );
  MyPings.associate = (db) => {
    db.MyPings.belongsTo(db.Category, { foreignKey: "category" });
    db.MyPings.belongsTo(db.User, {
      as: "Host",
      foreignKey: "user",
    });
    db.MyPings.belongsToMany(db.User, {
      through: db.SharePings,
      as: "Guests",
      foreignKey: "mypings",
    });
    db.MyPings.belongsToMany(db.Post, {
      through: db.MyPingsPost,
      foreignKey: "mypings",
    });
  };

  return MyPings;
};
