import express, { json } from 'express';
import {} from 'express-async-errors';
import { db } from '../../config/mysql.js';

const resultsRouter = express.Router();

resultsRouter.get('/', async (req, res, next) => {
  const { search_query, filter } = req.query;
  const conn = await db.getConnection();
  try {
    switch (filter) {
      // return post[], mypings[]
      case 'title':
        const post = await conn
          .execute(`SELECT * FROM POST as ps WHERE ps.title like '%${search_query}%' and ps.is_private = 0`)
          .then((res) => res[0]);
        const mypings = await conn
          .execute(`SELECT * FROM MYPINGS as mp WHERE mp.title like '%${search_query}%' and mp.is_private = 0`)
          .then((res) => res[0]);
        res.status(200).json({ post, mypings });

        break;
      // return post[]
      case 'content':
        break;
      // return user[]
      case 'user':
        break;
      // return mypings[]
      case 'category':
        break;
      // return post[]
      case 'hashtag':
        break;
      default:
        throw new Error('Invalid filter!');
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
