export default (sequelize, DataTypes) => {
  const PostHash = sequelize.define(
    'PostHash',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      post: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        foreignKey: true,
      },
      hash: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        foreignKey: true,
      },
    },
    {
      modelName: 'PostHash',
      tableName: 'POSTHASH',
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    }
  );

  return PostHash;
};
