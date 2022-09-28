export default (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      host: {
        type: DataTypes.INTEGER,
        as: 'Followings',
        primaryKey: true,
        foreignKey: true,
      },
      follow: {
        type: DataTypes.INTEGER,
        as: 'Followers',
        primaryKey: true,
        foreignKey: true,
      },
    },
    {
      modelName: 'Follow',
      tableName: 'FOLLOW',
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    }
  );

  return Follow;
};
