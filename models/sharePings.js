export default (sequelize, DataTypes) => {
  const SharePings = sequelize.define(
    'SharePings',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      host: {
        type: DataTypes.INTEGER.UNSIGNED,
        foreignKey: true,
      },
      mypings: {
        type: DataTypes.INTEGER.UNSIGNED,
        as: 'Guests',
        foreignKey: true,
      },
      guest: {
        type: DataTypes.INTEGER.UNSIGNED,
        as: 'MyPings',
        foreignKey: true,
      },
    },

    {
      modelName: 'SharePings',
      tableName: 'SHAREPINGS',
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

  SharePings.associate = (db) => {
    db.SharePings.belongsTo(db.User, { foreignKey: 'host' });
  };

  return SharePings;
};
