import { db } from '../../config/mysql.js';
import { resultRepository } from '../data/index.js';

export async function getResult(req, res, next) {
  const { search_query: query, filter } = req.query;
  const conn = await db.getConnection();
  try {
    let post, user, mypings;
    switch (filter) {
      case 'title':
        post = await resultRepository.getPostByTitle(conn, query);
        mypings = await resultRepository.getMyPingsByTitle(conn, query);
        return res.status(200).json({ post, mypings });

      case 'content':
        post = await resultRepository.getPostByContent(conn, query);
        console.log(post);
        return res.status(200).json({ post });

      case 'user':
        user = await resultRepository.getUserByNickname(conn, query);
        return res.status(200).json({ user });

      case 'category':
        mypings = await resultRepository.getMyPingsByCategory(conn, query);
        return res.status(200).json({ mypings });

      case 'hashtag':
        post = await resultRepository.getPostByHashtag(conn, query);
        console.log(post);
        return res.status(200).json({ post });
        break;
      default:
        throw new Error('Invalid filter!');
        break;
    }
  } catch (err) {
    return res.status(500).json({ message: `${err}` });
  } finally {
    conn.release();
  }
}
