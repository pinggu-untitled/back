import { USER_NUMBER } from '../controller/posts.js';
import { time } from '../middlewares/upload.js';

// 수정
export async function getAll(conn, postId) {
  return conn.execute('SELECT md.id, md.src FROM MEDIA as md WHERE md.post = ?', [postId]).then((result) => result[0]);
}

export async function create(conn, file, postId) {
  await conn.execute('UPDATE MEDIA as md SET md.post = null WHERE md.post = ?', [postId]);

  if (file.length !== 0) {
    if (file.includes('/')) {
      await conn.execute('UPDATE MEDIA as md SET md.post = ? WHERE src = ?', [postId, file]);
    } else {
      await conn.execute('INSERT into MEDIA (src, user, post) values (?, ?, ?)', [
        `${time.year}/${time.month}/${time.date}/${file}`,
        USER_NUMBER,
        Number(postId),
      ]);
    }
  }
}
