import { USER_NUMBER } from '../controller/posts.js';
import { time } from '../middlewares/upload.js';

export async function getAll(conn, postId) {
  return conn.execute('SELECT md.src FROM MEDIA as md WHERE md.post = ?', [postId]).then((result) => result[0]);
}

export async function create(conn, file, postId) {
  await conn.execute('INSERT into MEDIA (src, user, post) values (?, ?, ?)', [
    `${time.year}/${time.month}/${time.date}/${file}`,
    USER_NUMBER,
    postId,
  ]);
}
