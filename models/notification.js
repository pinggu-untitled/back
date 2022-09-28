export default (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      content: {
        type: DataTypes.STRING(30),
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('now()'),
      },
    },
    {
      modelName: 'Notification',
      tableName: 'NOTIFICATION',
      timestamps: false,
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    },
  );

  Notification.associate = (db) => {
    db.Notification.belongsTo(db.User, { as: 'Sender', foreignKey: 'sender' });
    db.Notification.belongsTo(db.User, {
      as: 'Receiver',
      foreignKey: 'receiver',
    });
  };

  return Notification;
};
