import { Router } from 'express';
import { db } from '../../config/mysql.js';
import { USER_NUMBER } from '../controller/posts.js';

const router = Router();

router.get('/', async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const data = await db.execute(
      `SELECT sh.id, sh.updated_at, s.content FROM SEARCHHISTORY as sh join SEARCH as s on sh.search = s.id WHERE sh.user = ? ORDER BY sh.updated_at desc;`,
      [USER_NUMBER],
    );
    return res.status(200).json(data[0]);
  } catch (err) {
    return res.status(500).json({ message: 'failed' });
  } finally {
    conn.release();
  }
});
router.post('/', async (req, res, next) => {
  const conn = await db.getConnection();
  const { content } = req.body;
  try {
    await conn.beginTransaction();
    let searchId = await conn
      .execute('INSERT ignore INTO SEARCH (content) values (?)', [content])
      .then((res) => res[0].insertId);
    if (!searchId) {
      searchId = await conn.execute('SELECT id from SEARCH WHERE content = ?', [content]).then((res) => res[0][0].id);
    }
    console.log(searchId);

    try {
      await conn.execute('INSERT INTO SEARCHHISTORY (user, search) values (?, ?)', [USER_NUMBER, searchId]);
    } catch (err) {
      await conn.execute('UPDATE SEARCHHISTORY SET updated_at = NOW() WHERE user = ? and search = ?', [
        USER_NUMBER,
        searchId,
      ]);
    }

    await conn.commit();
    res.status(200).json({ message: 'created' });
  } catch (err) {
    await conn.rollback();
    return res.status(400).json(err);
  } finally {
    conn.release();
  }
});
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
