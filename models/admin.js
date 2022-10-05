export default (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
      },
      pwd: {
        type: DataTypes.STRING(256),
      },
      level: {
        type: DataTypes.TINYINT,
      },
    },
    {
      modelName: 'Admin',
      tableName: 'ADMIN',
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    },
  );

  return Admin;
};
