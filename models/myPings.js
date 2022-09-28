export default (sequelize, DataTypes) => {
  const MyPings = sequelize.define(
    'MyPings',
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
      is_private: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      modelName: 'MyPings',
      tableName: 'MYPINGS',
      timestamps: true,
      underscored: true,
      paranoid: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    },
  );
  MyPings.associate = (db) => {
    db.MyPings.belongsTo(db.Category, { foreignKey: 'category' });
    db.MyPings.belongsTo(db.User, {
      as: 'Host',
      foreignKey: 'host',
    });
    db.MyPings.belongsToMany(db.User, {
      through: db.SharePings,
      as: 'Guests',
      foreignKey: 'mypings',
    });
    db.MyPings.belongsToMany(db.Post, {
      through: db.MyPingsPost,
      foreignKey: 'mypings',
    });
  };

  return MyPings;
};
