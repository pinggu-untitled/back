export default (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      host: {
        type: DataTypes.INTEGER.UNSIGNED,
        as: 'Followings',
        foreignKey: true,
      },
      follow: {
        type: DataTypes.INTEGER.UNSIGNED,
        as: 'Followers',
        foreignKey: true,
      },
    },
    {
      modelName: 'Follow',
      tableName: 'FOLLOW',
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

  return Follow;
};
