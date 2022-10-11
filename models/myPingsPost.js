export default (sequelize, DataTypes) => {
  const MyPingsPost = sequelize.define(
    'MyPingsPost',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      mypings: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
      post: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
    },
    {
      modelName: 'MyPingsPost',
      tableName: 'MYPINGSPOST',
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

  return MyPingsPost;
};
