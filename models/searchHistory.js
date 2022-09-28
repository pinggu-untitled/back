export default (sequelize, DataTypes) => {
  const SearchHistory = sequelize.define(
    'SearchHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      user: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        primaryKey: true,
      },
      search: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('now()'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('now()'),
      },
    },
    {
      modelName: 'SearchHistory',
      tableName: 'SEARCHHISTORY',
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    }
  );

  return SearchHistory;
};
