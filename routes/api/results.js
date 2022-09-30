import express, { json } from 'express';
import {} from 'express-async-errors';
import { db } from '../../config/mysql.js';

const resultsRouter = express.Router();

resultsRouter.get('/', async (req, res, next) => {
  const { search_query, filter } = req.query;
  const conn = await db.getConnection();
  try {
    let post, user, mypings;
    switch (filter) {
      // FIXME
      // return post[], mypings[]
      case 'title':
        post = await conn
          .execute(
            `SELECT ps.id, ps.title, ps.content, ps.longitude, ps.latitude, ps.hits, ps.is_private, ps.created_at, ps.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as ps join USER as us on ps.user = us.id WHERE ps.title like '%${search_query}%'`,
          )
          .then((res) => res[0])
          .then((res) => {
            return res.map((item) => {
              const { userId, nickname, profile_image_url } = item;
              item.userId = undefined;
              item.nickname = undefined;
              item.profile_image_url = undefined;
              return {
                ...item,
                User: {
                  id: userId,
                  nickname,
                  profile_image_url,
                },
              };
            });
          });
        mypings = await conn
          .execute(
            `SELECT mp.id, mp.title, mp.category, mp.is_private, mp.created_at, mp.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM MYPINGS as mp join USER as us on us.id = mp.user WHERE mp.title like '%${search_query}%'`,
          )
          .then((res) => res[0])
          .then((res) => {
            return res.map((item) => {
              const { userId, nickname, profile_image_url } = item;
              item.userId = undefined;
              item.nickname = undefined;
              item.profile_image_url = undefined;
              return {
                ...item,
                User: {
                  id: userId,
                  nickname,
                  profile_image_url,
                },
              };
            });
          });
        return res.status(200).json({ post, mypings });

      // FIXME
      // return post[]
      case 'content':
        post = await conn
          .execute(
            `SELECT ps.id, ps.title, ps.content, ps.longitude, ps.latitude, ps.hits, ps.is_private, ps.created_at, ps.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as ps join USER as us on ps.user = us.id WHERE ps.content like '%${search_query}%'`,
          )
          .then((res) => res[0])
          .then((res) => {
            return res.map((item) => {
              const { userId, nickname, profile_image_url } = item;
              item.userId = undefined;
              item.nickname = undefined;
              item.profile_image_url = undefined;
              return {
                ...item,
                User: {
                  id: userId,
                  nickname,
                  profile_image_url,
                },
              };
            });
          });

        return res.status(200).json({ post });

      // FIXME
      // return user[]
      case 'user':
        user = await conn
          .execute(
            `SELECT us.id, us.nickname, us.profile_image_url FROM USER as us WHERE us.nickname like '%${search_query}%'`,
          )
          .then((res) => res[0]);
        return res.status(200).json({ user });
        break;

      // TODO user 정보 엮어주기
      // return mypings[]
      case 'category':
        mypings = await conn
          .execute(
            `SELECT mp.id, mp.title, mp.category, mp.is_private, us.id as userId, us.nickname, us.profile_image_url from MYPINGS as mp join USER as us on us.id = mp.user WHERE mp.category = ?`,
            [search_query],
          )
          .then((res) => res[0])
          .then((res) => {
            return res.map((item) => {
              const { userId, nickname, profile_image_url } = item;
              item.userId = undefined;
              item.nickname = undefined;
              item.profile_image_url = undefined;
              return {
                ...item,
                User: {
                  id: userId,
                  nickname,
                  profile_image_url,
                },
              };
            });
          });
        return res.status(200).json({ mypings });
        break;

      /**
       * ;
       */
      // TODO user 정보 엮어주기
      // return post[]
      case 'hashtag':
        post = await conn
          .execute(
            `SELECT ps.id, ps.title, ps.content, ps.longitude, ps.latitude, ps.hits, ps.is_private, ps.created_at, ps.updated_at, us.id as userId, us.nickname, us.profile_image_url 
	FROM POST as ps 
    join USER as us 
    on ps.user = us.id
    WHERE ps.id in 
    (select ph.post from HASHTAG as ht 
	join POSTHASH as ph 
    on ht.id = ph.hash 
    WHERE content like '%맛집%');`,
          )
          .then((res) => res[0])
          .then((res) => {
            return res.map((item) => {
              const { userId, nickname, profile_image_url } = item;
              item.userId = undefined;
              item.nickname = undefined;
              item.profile_image_url = undefined;
              return {
                ...item,
                User: {
                  id: userId,
                  nickname,
                  profile_image_url,
                },
              };
            });
          });
        return res.status(200).json({ post });
        break;
      default:
        throw new Error('Invalid filter!');
        break;
    }
  } catch (err) {
    return res.status(500).json({ message: 'failed' });
  } finally {
    conn.release();
  }
});

export default resultsRouter;

// search filter
// (title) => post, mypings;
// (content) => post;
// (user) => user;
// (category) => mypings;
// (hashtag) => post;
