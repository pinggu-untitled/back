import { db } from '../../config/mysql.js';
import { fileRepository, likeRepository, resultRepository } from '../data/index.js';

export async function getResult(req, res, next) {
  const { search_query: query, filter } = req.query;
  const conn = await db.getConnection();
  try {
    let post, user, mypings, ids, allImages, allLikers, Images, Likers;
    switch (filter) {
      case 'post':
        post = await resultRepository.getPostBySearch(conn, query);
        ids = post.map((dt) => dt.id);
        allImages = await fileRepository.getByIds(conn, ids);
        allLikers = await likeRepository.getByIds(conn, ids);
        post = post.map((el) => {
          const Images = allImages.filter((img) => img.post === el.id);
          const Likers = allLikers.filter((liker) => liker.post === el.id);
          return {
            ...el,
            Images,
            Likers,
          };
        });
        console.log('hello');
        console.log('>>>>>>>>', post);
        // mypings = await resultRepository.getMyPingsByTitle(conn, query);
        // return res.status(200).json({ post, mypings });

        // case 'content':
        //   post = await resultRepository.getPostByContent(conn, query);
        //   ids = post.map((dt) => dt.id);
        //   allImages = await fileRepository.getByIds(conn, ids);
        //   allLikers = await likeRepository.getByIds(conn, ids);
        //   post = post.map((post) => {
        //     Images = allImages.filter((img) => img.post === id);
        //     Likers = allLikers.filter((post) => post.id === id);
        //     return {
        //       ...post,
        //       Images,
        //       Likers,
        //     };
        //   });
        return res.status(200).json({ post });

      case 'user':
        user = await resultRepository.getUserByNickname(conn, query);
        return res.status(200).json({ user });

      case 'mypings':
        mypings = await resultRepository.getMyPingsByTitle(conn, query);
        return res.status(200).json({ mypings });

      case 'hashtag':
        post = await resultRepository.getPostByHashtag(conn, query);
        ids = post.map((dt) => dt.id);
        allImages = await fileRepository.getByIds(conn, ids);
        allLikers = await likeRepository.getByIds(conn, ids);
        post = post.map((el) => {
          const Images = allImages.filter((img) => img.post === el.id);
          const Likers = allLikers.filter((liker) => liker.post === el.id);
          return {
            ...el,
            Images,
            Likers,
          };
        });
        return res.status(200).json({ post });
      default:
        throw new Error('Invalid filter!');
    }
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
