import { time } from '../middlewares/upload.js';

// 수정
export async function getAll(conn, postId) {
  return conn.execute('SELECT md.id, md.src FROM MEDIA as md WHERE md.post = ?', [postId]).then((result) => result[0]);
}

export async function getByIds(conn, ids) {
  return conn.execute('SELECT md.id, md.src FROM MEDIA as md WHERE md.post in (?)', [ids]).then((result) => result[0]);
}

export async function create(conn, userId, file, postId) {
  if (file.includes('/')) {
    await conn.execute('UPDATE MEDIA as md SET md.post = ? WHERE src = ?', [postId, file]);
  } else {
    await conn.execute('INSERT into MEDIA (src, user, post) values (?, ?, ?)', [
      `${time.year}/${time.month}/${time.date}/${file}`,
      Number(userId),
      Number(postId),
    ]);
  }
}
