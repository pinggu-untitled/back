export default (sequelize, DataTypes) => {
  const Media = sequelize.define(
    "Media", // images 테이블 생성
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      src: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },
    },
    {
      modelName: "Media",
      tableName: "MEDIA",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );
  Media.associate = (db) => {
    db.Media.belongsTo(db.Post, { foreignKey: "post" });
    db.Media.belongsTo(db.User, { foreignKey: "user" });
  };
  return Media;
};
