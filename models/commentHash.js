export default (sequelize, DataTypes) => {
  const CommentHash = sequelize.define(
    'CommentHash',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      comment: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
      hash: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
    },
    {
      modelName: 'CommentHash',
      tableName: 'COMMENTHASH',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    }
  );

  return CommentHash;
};
