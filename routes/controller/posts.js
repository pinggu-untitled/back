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
    const data = await postRepository.getFollowing(conn);
    const result = data.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      longitude: post.longitude,
      latitude: post.latitude,
      hits: post.hits,
      is_private: post.is_private,
      created_at: post.created_at,
      updated_at: post.updated_at,
      User: {
        id: post.userId,
        nickname: post.nickname,
        profile_image_url: post.profile_image_url,
      },
    }));
    const totalCount = result.length;
    const totalPages = Math.round(totalCount / size);

    setTimeout(() => {
      return res.status(200).json({
        contents: result.slice(page * size, (page + 1) * size),
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
    let [post, Likers, Comments, childComments, Images] = await Promise.all([
      postRepository.getById(conn, postId),
      likeRepository.getAll(conn, postId),
      commentRepository.getParentComments(conn, postId),
      commentRepository.getChildComments(conn, postId),
      fileRepository.getAll(conn, postId),
    ]);
    const { userId, nickname, profile_image_url } = post;
    post.userId = undefined;
    post.nickname = undefined;
    post.profile_image_url = undefined;
    Comments = Comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      pid: comment.pid,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      User: {
        id: comment.userId,
        nickname: comment.nickname,
        profile_image_url: comment.profile_image_url,
      },
    }));
    childComments = childComments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      pid: comment.pid,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      User: {
        id: comment.userId,
        nickname: comment.nickname,
        profile_image_url: comment.profile_image_url,
      },
    }));

    Comments.map((comment) => {
      comment.Comments = childComments.filter((el) => el.pid === comment.id);
      return comment;
    });

    post.Hashtags = await postRepository.getPostHashTags(conn, postId);
    post.Mentions = await postRepository.getPostMentions(conn, postId);
    post.Images = Images;
    post.User = { id: userId, nickname, profile_image_url };
    post.Comments = Comments;
    post.Likers = Likers;
    return res.status(200).json({ post });
  } catch (err) {
    return res.status(404).json(err);
  } finally {
    conn.release();
  }
}

export async function createPost(req, res, next) {
  const { title, content, longitude, latitude, is_private } = req.body;
  const { mentions, hashtags, images } = req.body;
  const post = { title, content, longitude, latitude, is_private };
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

export async function createMedia(req, res, next) {
  const images = req.files;
  return res.status(200).json(images.map((el) => el.filename));
}

//FIXME Patch 수정하기
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
    const post = await postRepository.getById(conn, postId);
    if (!post) {
      return res.sendStatus(404);
    }
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
