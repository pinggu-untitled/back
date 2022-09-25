export default (sequelize, DataTypes) => {
  const Mention = sequelize.define(
    "Mention", // posts 테이블 생성
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      sender: {
        type: DataTypes.NUMBER,
        foreignKey: true,
        as: "Sender"
      },
      receiver: {
        type: DataTypes.NUMBER,
        foreignKey: true,
        as: "Receiver"
      },
      comment: {
        type: DataTypes.NUMBER,
        foreignKey: true,
      },
      post: {
        type: DataTypes.NUMBER,
        foreignKey: true,
      },
    },
    {
      modelName: "Mention",
      tableName: "MENTION",
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );

  Mention.associate = (db) => {
    db.Mention.belongsTo(db.Post, { foreignKey: "post" });
    db.Mention.belongsTo(db.Comment, { foreignKey: "comment" });
    db.Mention.belongsTo(db.User, { as: "Sender", foreignKey: "sender" });
    db.Mention.belongsTo(db.User, { as: "Receiver", foreignKey: "receiver" });
  };

  return Mention;
};
