export default (sequelize, DataTypes) => {
  const Search = sequelize.define(
    'Search',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      content: {
        type: DataTypes.STRING,
        as: 'Searches',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('now()'),
      },
    },
    {
      modelName: 'Search',
      tableName: 'SEARCH',
      timestamps: true,
      updatedAt: false,
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    },
  );

  Search.associate = (db) => {
    db.Search.belongsToMany(db.User, {
      through: db.SearchHistory,
      as: 'Searchers',
      foreignKey: 'search',
    });
  };

  return Search;
};
