export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      profile_image_url: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      social_links: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      bio: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      userid: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_logged_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      modelName: "User",
      tableName: "USER",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
      paranoid: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      sequelize,
    }
  );

  User.associate = (db) => {
    db.User.hasMany(db.Post, { foreignKey: "user" });
    db.User.hasMany(db.Comment, { foreignKey: "user" });
    db.User.belongsToMany(db.Post, {
      through: db.Liked,
      foreignKey: "user",
    });
    db.User.belongsToMany(db.User, {
      through: db.Follow,
      as: "Followers",
      foreignKey: "follow",
    });
    db.User.belongsToMany(db.User, {
      through: db.Follow,
      as: "Followings",
      foreignKey: "host",
    });
    db.User.hasMany(db.Chat, { foreignKey: "sender" });
    db.User.belongsToMany(db.Chatroom, {
      through: db.ChatroomMember,
      foreignKey: "user",
    });
    db.User.hasMany(db.MyPings, {
      foreignKey: "host",
    });

    db.User.belongsToMany(db.MyPings, {
      through: db.SharePings,
      foreignKey: "guest",
    });
    db.User.belongsToMany(db.Search, {
      through: db.SearchHistory,
      as: "Searches",
      foreignKey: "user",
    });
    db.User.hasMany(db.SharePings, {
      foreignKey: "host",
    });
    db.User.hasMany(db.Notification, { foreignKey: "sender" });
    db.User.hasMany(db.Notification, { foreignKey: "receiver" });
    db.User.hasMany(db.ServicePost, { foreignKey: "user" });
  };

  return User;
};
