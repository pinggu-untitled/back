export default (sequelize, DataTypes) => {
  const SearchHistory = sequelize.define(
    'SearchHistory',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      user: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
      search: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
    },
    {
      modelName: 'SearchHistory',
      tableName: 'SEARCHHISTORY',
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

  return SearchHistory;
};
