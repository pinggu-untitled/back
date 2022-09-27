export default (sequelize, DataTypes) => {
  const SharePings = sequelize.define(
    'SharePings',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      host: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        primaryKey: true,
      },
      mypings: {
        type: DataTypes.INTEGER,
        as: 'Guests',
        foreignKey: true,
        primaryKey: true,
      },
      guest: {
        type: DataTypes.INTEGER,
        as: 'MyPings',
        foreignKey: true,
        primaryKey: true,
      },
    },

    {
      modelName: 'SharePings',
      tableName: 'SHAREPINGS',
      timestamps: true,
      underscored: true,
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    },
  );

  SharePings.associate = (db) => {
    db.SharePings.belongsTo(db.User, { foreignKey: 'host' });
  };

  return SharePings;
};
