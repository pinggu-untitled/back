export default (sequelize, DataTypes) => {
  const Chatroom = sequelize.define(
    'Chatroom',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
    },
    {
      modelName: 'Chatroom',
      tableName: 'CHATROOM',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    },
  );

  Chatroom.associate = (db) => {
    db.Chatroom.belongsToMany(db.User, {
      through: db.ChatroomMember,
      as: 'Members',
      foreignKey: 'chatroom',
    });
    db.Chatroom.hasMany(db.Chat, { as: 'Chats', foreignKey: 'chatroom' });
  };
  return Chatroom;
};
