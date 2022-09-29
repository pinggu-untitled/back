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
    const data = await postRepository.getAll(conn);
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

    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json(err);
  } finally {
    conn.release();
  }
}

export async function createPost(req, res, next) {
  const { title, content, longitude, latitude, is_private } = req.body;
  const { mentions, hashtags, files } = req.body;
  const post = { title, content, longitude, latitude };
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const newPost = await postRepository
      .create(conn, post, mentions, hashtags, files)
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

export async function createMedia(req, res, next) {
  const images = req.files;
  return res.status(200).json(images.map((el) => el.filename));
}

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
