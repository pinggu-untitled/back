import { db } from '../../config/mysql.js';
import { USER_NUMBER } from './posts.js';
import * as likeRepository from '../data/liked.js';

export async function getLiked(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    const data = await likeRepository.getAll(conn, postId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
export async function createLiked(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    await likeRepository.create(conn, Number(postId), USER_NUMBER);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
export async function removeLiked(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  try {
    await likeRepository.remove(conn, Number(postId), USER_NUMBER);
    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}