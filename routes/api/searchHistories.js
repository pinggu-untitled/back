import { Router } from 'express';
import { db } from '../../config/mysql.js';
import { USER_NUMBER } from '../controller/posts.js';

const router = Router();

router.get('/', async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const data = await db.execute(
      `SELECT sh.id, sh.updated_at, s.content FROM SEARCHHISTORY as sh join SEARCH as s on sh.id = s.id WHERE sh.user = ? ORDER BY sh.updated_at desc`,
      [USER_NUMBER],
    );
    return res.status(200).json(data[0]);
  } catch (err) {
    return res.status(500).json({ message: 'failed' });
  } finally {
    conn.release();
  }
});
router.post('/', async (req, res, next) => {});
router.delete('/', async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    await db.execute(`DELETE FROM SEARCHHISTORY as sh WHERE sh.user = ?`, [historyId, USER_NUMBER]);
    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'failed' });
  } finally {
    conn.release();
  }
});
router.delete('/:historyId', async (req, res, next) => {
  const conn = await db.getConnection();
  const { historyId } = req.params;
  try {
    await db.execute(`DELETE FROM SEARCHHISTORY as sh WHERE sh.id = ? and sh.user = ?`, [historyId, USER_NUMBER]);
    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'failed' });
  } finally {
    conn.release();
  }
});
router.get('/popular', async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const data = await db.execute(
      `SELECT s.content, count(*) as count FROM SEARCHHISTORY as sh join SEARCH as s on sh.search = s.id group by s.content order by count desc limit 10`,
    );
    return res.status(200).json(data[0]);
  } catch (err) {
    return res.status(500).json({ message: 'failed' });
  } finally {
    conn.release();
  }
});

export default router;
