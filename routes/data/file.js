import { USER_NUMBER } from '../controller/posts.js';

export async function getAll(conn, postId) {
  return conn
    .execute('SELECT md.src, md.user FROM MEDIA as md WHERE md.post = ?', [
      postId,
    ])
    .then((result) => result[0]);
}

export async function create(conn, file, postId) {
  const filePath = file.path.replaceAll('\\', '/');
  await conn.execute('INSERT into MEDIA (src, user, post) values (?, ?, ?)', [
    filePath.replace('upload/images/', ''),
    USER_NUMBER,
    postId,
  ]);
}
