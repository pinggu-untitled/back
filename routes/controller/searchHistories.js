import { searchHistoryRepository } from '../data/index.js';
import { db } from '../../config/mysql.js';

export async function getHistory(req, res, next) {
  const conn = await db.getConnection();
  try {
    const userId = req.user.id;
    const data = await searchHistoryRepository.getAll(conn, userId);
    return res.status(200).json(data);
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function createHistory(req, res, next) {
  const conn = await db.getConnection();
  const { content } = req.body;
  const userId = req.user.id;
  try {
    await conn.beginTransaction();
    await searchHistoryRepository.create(conn, userId, content);
    await conn.commit();
    res.status(200).json({ message: 'created' });
  } catch (err) {
    await conn.rollback();
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function deleteHistoryAll(req, res, next) {
  const conn = await db.getConnection();
  const userId = req.user.id;
  try {
    await searchHistoryRepository.remove(conn, userId);
    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function deleteHistoryById(req, res, next) {
  const conn = await db.getConnection();
  const { historyId } = req.params;
  const userId = req.user.id;
  try {
    searchHistoryRepository.removeById(conn, userId, historyId);
    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function getPopular(req, res, next) {
  const conn = await db.getConnection();
  try {
    const data = await searchHistoryRepository.getPopular(conn);
    return res.status(200).json(data);
  } catch (err) {
    logger.error(`Server Error`);
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}
