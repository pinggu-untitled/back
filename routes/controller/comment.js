import {} from 'express-async-errors';
import { db } from '../../config/mysql.js';
import * as commentRepository from '../data/comment.js';

export async function getComment(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    let data = await commentRepository.getAll(conn, postId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
export async function createComment(req, res, next) {
  const { postId } = req.params;
  const { pid, content } = req.body;
  const conn = await db.getConnection();
  try {
    const insertData = await commentRepository.create(conn, pid, postId, content);
    res.status(200).json(insertData);
  } catch (err) {
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
    let updateData = await commentRepository.update(conn, content, commentId);
    res.status(200).json(updateData);
  } catch (err) {
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
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
