export default (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
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
      longitude: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      is_private: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: false,
      },
      hits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      modelName: 'Post',
      tableName: 'POST',
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
  Post.associate = (db) => {
    db.Post.belongsTo(db.User, { foreignKey: 'user' });
    db.Post.hasMany(db.Media, { foreignKey: 'post', as: 'Images' });
    db.Post.hasMany(db.Comment, { foreignKey: 'post' });
    db.Post.belongsToMany(db.Hashtag, {
      through: db.PostHash,
      foreignKey: 'post',
    });
    db.Post.hasMany(db.Mention, { foreignKey: 'post' });
    // db.Post.belongsToMany(db.User, {
    //   through: db.Liked,
    //   as: 'Likers',
    //   foreignKey: 'post',
    // });
    db.Post.hasMany(db.Liked, { foreignKey: 'post', as: 'Likers', sourceKey: 'id' });
    db.Post.belongsToMany(db.MyPings, {
      through: db.MyPingsPost,
      foreignKey: 'post',
    });
  };

  return Post;
};
