export default (sequelize, DataTypes) => {
  const ServicePost = sequelize.define(
    'ServicePost',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(30),
      },
      content: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      hits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      modelName: 'ServicePost',
      tableName: 'SERVICEPOST',
      timestamps: true,
      underscored: true,
      paranoid: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    }
  );

  ServicePost.associate = (db) => {
    db.ServicePost.belongsTo(db.User, { foreignKey: 'user' });
  };

  return ServicePost;
};
