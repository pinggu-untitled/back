export default (sequelize, DataTypes) => {
  const Liked = sequelize.define(
    'Liked',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
      post: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
    },
    {
      modelName: 'Liked',
      tableName: 'LIKED',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    },
  );

  return Liked;
};
