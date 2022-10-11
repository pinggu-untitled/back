export default (sequelize, DataTypes) => {
  const Mention = sequelize.define(
    'Mention', // posts 테이블 생성
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      sender: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
        as: 'Sender',
      },
      receiver: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
        as: 'Receiver',
      },
      comment: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
      post: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
    },
    {
      modelName: 'Mention',
      tableName: 'MENTION',
      timestamps: true,
      underscored: true,
      paranoid: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    },
  );

  Mention.associate = (db) => {
    db.Mention.belongsTo(db.Post, { foreignKey: 'post' });
    db.Mention.belongsTo(db.Comment, { foreignKey: 'comment' });
    db.Mention.belongsTo(db.User, { as: 'Sender', foreignKey: 'sender' });
    db.Mention.belongsTo(db.User, { as: 'Receiver', foreignKey: 'receiver' });
  };

  return Mention;
};
