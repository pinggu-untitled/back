export default (sequelize, DataTypes) => {
  const PostHash = sequelize.define(
    'PostHash',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      post: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
      hash: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
    },
    {
      modelName: 'PostHash',
      tableName: 'POSTHASH',
      timestamps: true,
      underscored: true,
      paranoid: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    }
  );

  return PostHash;
};
