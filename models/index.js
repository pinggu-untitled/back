import Sequelize from 'sequelize';

import admin from './admin.js';
import category from './category.js';
import chatroom from './chatroom.js';
import chatroomMember from './chatroomMember.js';
import chat from './chat.js';
import comment from './comment.js';
import commentHash from './commentHash.js';
import follow from './follow.js';
import hashtag from './hashtag.js';
import liked from './liked.js';
import media from './media.js';
import mention from './mention.js';
import myPings from './myPings.js';
import myPingsPost from './myPingsPost.js';
import notification from './notification.js';
import post from './post.js';
import postHash from './postHash.js';
import search from './search.js';
import searchHistory from './searchHistory.js';
import servicePost from './servicePost.js';
import sharePings from './sharePings.js';
import user from './user.js';

const env = process.env.NODE_ENV || 'development';
import config from '../config/config.js';
const conf = config[env];
const sequelize = new Sequelize(conf.database, conf.username, conf.password, conf);

const db = {};
db.Admin = admin(sequelize, Sequelize);
db.Category = category(sequelize, Sequelize);
db.Chatroom = chatroom(sequelize, Sequelize);
db.ChatroomMember = chatroomMember(sequelize, Sequelize);
db.Comment = comment(sequelize, Sequelize);
db.CommentHash = commentHash(sequelize, Sequelize);
db.Chat = chat(sequelize, Sequelize);
db.Follow = follow(sequelize, Sequelize);
db.Hashtag = hashtag(sequelize, Sequelize);
db.Liked = liked(sequelize, Sequelize);
db.Mention = mention(sequelize, Sequelize);
db.Media = media(sequelize, Sequelize);
db.MyPings = myPings(sequelize, Sequelize);
db.MyPingsPost = myPingsPost(sequelize, Sequelize);
db.Notification = notification(sequelize, Sequelize);
db.Post = post(sequelize, Sequelize);
db.PostHash = postHash(sequelize, Sequelize);
db.Search = search(sequelize, Sequelize);
db.SearchHistory = searchHistory(sequelize, Sequelize);
db.ServicePost = servicePost(sequelize, Sequelize);
db.SharePings = sharePings(sequelize, Sequelize);
db.User = user(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
