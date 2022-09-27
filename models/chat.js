export default (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    'Chat',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      content: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      read_flag: {
        type: DataTypes.TINYINT(1),
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('now()'),
      },
    },
    {
      modelName: 'Chat',
      tableName: 'CHAT',
      timestamps: false,
      underscored: false,
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    },
  );

  Chat.associate = (db) => {
    db.Chat.belongsTo(db.User, { foreignKey: 'sender' });
    db.Chat.belongsTo(db.Chatroom, { foreignKey: 'chatroom' });
  };

  return Chat;
};
