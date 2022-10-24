import {} from 'express-async-errors';
import logger from '../../config/logger.js';
import { db } from '../../config/mysql.js';
import * as commentRepository from '../data/comment.js';

export async function getComment(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    // const data = await commentRepository.getAll(conn, postId);
    // return res.status(200).json(data);
    let [Comments, childComments] = await Promise.all([
      commentRepository.getParentComments(conn, postId),
      commentRepository.getChildComments(conn, postId),
    ]);

    Comments = Comments.map(({ id, content, pid, created_at, updated_at, userId, nickname, profile_image_url }) => ({
      id,
      content,
      pid,
      created_at,
      updated_at,
      User: {
        id: userId,
        nickname,
        profile_image_url,
      },
    }));
    childComments = childComments.map(
      ({ id, content, pid, created_at, updated_at, userId, nickname, profile_image_url }) => ({
        id,
        content,
        pid,
        created_at,
        updated_at,
        User: {
          id: userId,
          nickname,
          profile_image_url,
        },
      }),
    );

    Comments.map((comment) => {
      comment.Comments = childComments.filter((el) => el.pid === comment.id);
      return comment;
    });

    res.status(200).json(Comments);
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
export async function createComment(req, res, next) {
  const { postId } = req.params;
  const { pid, content } = req.body;
  const userId = req.user.id;
  const conn = await db.getConnection();
  try {
    const insertData = await commentRepository.create(conn, userId, pid, postId, content);
    res.status(200).json(insertData);
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
export async function updateComment(req, res, next) {
  const { commentId } = req.params;
  const { content } = req.body;
  const conn = await db.getConnection();
  try {
    const updateData = await commentRepository.update(conn, content, commentId);
    res.status(200).json(updateData);
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
export async function removeComment(req, res, next) {
  const conn = await db.getConnection();
  const { commentId } = req.params;
  try {
    await conn.beginTransaction();
    await commentRepository.remove(conn, commentId);
    await conn.commit();
    res.status(200).json({ message: 'deleted' });
  } catch (err) {
    await conn.rollback();
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
