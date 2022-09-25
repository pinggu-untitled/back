export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      content: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      modelName: "Comment",
      tableName: "COMMENT",
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      sequelize,
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User, { foreignKey: "user" });
    db.Comment.belongsTo(db.Post, { foreignKey: "post" });
    db.Comment.hasMany(db.Mention, { foreignKey: "comment" });
    db.Comment.belongsTo(db.Comment, { foreignKey: "pid" });
    db.Comment.belongsToMany(db.Hashtag, {
      through: db.CommentHash,
      foreignKey: "comment",
    });
  };
  return Comment;
};
