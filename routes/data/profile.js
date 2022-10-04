import { USER_NUMBER } from '../controller/posts.js';
import { time } from '../middlewares/upload.js';

export async function getAll(conn, postId) {
  return conn.execute('SELECT md.src FROM MEDIA as md WHERE md.post = ?', [postId]).then((result) => result[0]);
}

export async function updateProfileImages(conn, file, postId) {
  await conn.execute('INSERT into MEDIA (src, user, post) values (?, ?, ?)', [
    `${time.year}/${time.month}/${time.date}/${file}`,
    USER_NUMBER,
    postId,
  ]);
}

export async function updateProfileInfo(conn, userId, nickname, bio) {
  await conn.execute('UPDATE USER SET nickname = ?, bio = ? WHERE id = ?', [nickname, bio, userId]);
}