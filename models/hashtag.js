export default (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    'Hashtag',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      content: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {
      modelName: 'Hashtag',
      tableName: 'HASHTAG',
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

  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, {
      through: db.PostHash,
      foreignKey: 'hash',
    });
    db.Hashtag.belongsToMany(db.Comment, {
      through: db.CommentHash,
      foreignKey: 'hash',
    });
  };
  return Hashtag;
};
