import { db } from '../../config/mysql.js';
import { postRepository, likeRepository, commentRepository, fileRepository } from '../data/index.js';

export const rand = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1)) + start;
};

export const USER_NUMBER = rand(1, 10);

export async function getPosts(req, res, next) {
  console.log('hello');
  const conn = await db.getConnection();
  const size = Number(req.query.size);
  const page = Number(req.query.page);
  console.log('hello@@');

  try {
    /**
     * 전체 post return
     */
    // const data = await postRepository.getAll(conn);
    // return res.status(200).json(data);

    /**
     * infinite scroll return
     */
    const data = await postRepository.getFollwing(conn);
    const totalCount = data.length;
    const totalPages = Math.round(totalCount / size);

    setTimeout(() => {
      return res.status(200).json({
        contents: data.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalPages,
        totalCount,
        isLastPage: totalPages <= page,
        isFirstPage: page === 0,
      });
    }, 300);
    // return res.status(200).json({
    //   contents: data.slice(page * size, (page + 1) * size),
    //   pageNumber: page,
    //   pageSize: size,
    //   totalPages,
    //   totalCount,
    //   isLastPage: totalPages <= page,
    //   isFirstPage: page === 0,
    // });
  } catch (err) {
    return res.status(404).json(err);
  } finally {
    conn.release();
  }
}

export async function getPost(req, res, next) {
  console.log('hello');
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    const result = {};
    [result.post, result.likers, result.parentComments, result.childComments, result.files] = await Promise.all([
      postRepository.getById(conn, postId),
      likeRepository.getAll(conn, postId),
      commentRepository.getParentComments(conn, postId),
      commentRepository.getChildComments(conn, postId),
      fileRepository.getAll(conn, postId),
    ]);
    // [
    //   result.post,
    //   result.likers,
    //   result.parentComments,
    //   result.childComments,
    //   result.files,
    // ] = data;

    // result.post = await postRepository.getById(conn, postId);
    // result.likers = await likeRepository.getAll(conn, postId);
    // result.parentComments = await commentRepository.getParentComments(
    //   conn,
    //   postId
    // );
    // result.childComments = await commentRepository.getChildComments(
    //   conn,
    //   postId
    // );
    // result.files = await fileRepository.getAll(conn, postId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json(err);
  } finally {
    conn.release();
  }
}

function getBody(string) {
  const stringData = JSON.stringify(string).replaceAll(' ', '').split(`\\n`).join('').split('\\').join('');
  const { post, mentions, hashtags } = JSON.parse(stringData.substring(1, stringData.length - 1));
  return { post, mentions, hashtags };
}

export async function createPost(req, res, next) {
  // { post.title, post.content, post.longitude, post.latitude, post.is_private } = req.body;

  console.log(req.body);
  const { title, content, longitude, latitude, is_private } = req.body;
  const { mentions, hashtags, images } = req.body;
  const post = { title, content, longitude, latitude };
  console.log(post, 'posts!!!!!!!');
  console.log(mentions, hashtags, '@@@@@@@@@@@@@');
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const newPost = await postRepository
      .create(conn, post, mentions, hashtags, images)
      .then((result) => result)
      .catch(console.error);

    await conn.commit();
    return res.status(201).json(newPost);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

// export async function createMedia(req, res, next) {
//   const { postId } = req.data;
//   const { files } = req.files;
//   const conn = await db.getConnection();
//   try {
//     await postRepository.createMedia(conn, files, postId);
//     return res.status(201).json({ message: 'success' });
//   } catch (err) {
//     return res.status(500).json(err);
//   } finally {
//     conn.release();
//   }
// }
export async function createMedia(req, res, next) {
  const images = req.files;
  return res.status(200).json(images.map((el) => el.filename));
}

// export async function createPostWithMedia(req, res, next) {
//   const { post, mentions, hashtags, files } = req.body;
//   const conn = await db.getConnection();
//   try {
//     await conn.beginTransaction();
//     const newPost = await postRepository
//       .create(conn, post, mentions, hashtags)
//       .then((result) => result)
//       .catch(console.error);
//     await conn.commit();
//     return res.status(200).json(newPost);
//   } catch (err) {
//     await conn.rollback();
//     return res.status(500).json(err);
//   } finally {
//     conn.release();
//   }
// }

export async function updatePost(req, res, next) {
  const { post, mentions, hashtags } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const updatePost = await postRepository.update(conn, post, mentions, hashtags, req.params.postId);

    await conn.commit();
    return res.status(201).json(updatePost);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function removePost(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await postRepository.remove(conn, postId);
    await conn.commit();
    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    await conn.rollback();
    return res.status(400).json(err);
  } finally {
    conn.release();
  }
}
