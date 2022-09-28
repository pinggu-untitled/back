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
      // return post[], mypings[]
      case 'title':
        post = await conn
          .execute(`SELECT * FROM POST as ps WHERE ps.title like '%${search_query}%' and ps.is_private = 0`)
          .then((res) => res[0]);
        mypings = await conn
          .execute(`SELECT * FROM MYPINGS as mp WHERE mp.title like '%${search_query}%' and mp.is_private = 0`)
          .then((res) => res[0]);
        return res.status(200).json({ post, mypings });
      // return post[]
      case 'content':
        post = await conn
          .execute(`SELECT * FROM POST as ps WHERE ps.content like '%${search_query}%' and ps.is_private = 0`)
          .then((res) => res[0]);
        return res.status(200).json({ post });
      // return user[]
      case 'user':
        user = await conn
          .execute(`SELECT * FROM USER as us WHERE us.nickname like '%${search_query}%'`)
          .then((res) => res[0]);
        return res.status(200).json({ user });
        break;
      // return mypings[]
      case 'category':
        break;
      // return post[]
      case 'hashtag':
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
