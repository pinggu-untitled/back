export default (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      content: {
        type: DataTypes.STRING(30),
      },
    },
    {
      modelName: "Notification",
      tableName: "NOTIFICATION",
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );

  Notification.associate = (db) => {
    db.Notification.belongsTo(db.User, { as: "Sender", foreignKey: "sender" });
    db.Notification.belongsTo(db.User, {
      as: "Receiver",
      foreignKey: "receiver",
    });
  };

  return Notification;
};
