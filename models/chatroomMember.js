export default (sequelize, DataTypes) => {
  const ChatroomMember = sequelize.define(
    'ChatroomMember',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      chatroom: {
        type: DataTypes.INTEGER,
        as: 'Members',
        foreignKey: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('now()'),
      },
    },
    {
      modelName: 'ChatroomMember',
      tableName: 'CHATROOMMEMBER',
      timestamps: false,
      underscored: false,
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    }
  );

  return ChatroomMember;
};
