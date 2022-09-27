import { USER_NUMBER } from '../controller/posts.js';

export async function getAll(conn, postId) {
  return conn.execute(`SELECT * FROM COMMENT WHERE COMMENT.post = ?`, [Number(postId)]).then((result) => result[0]);
}
export async function create(conn, pid, postId, content) {
  //   if (pid !== undefined) {
  //     const comment = await conn.execute(
  //       `SELECT * FROM COMMENT WHERE COMMENT.id = ?`,
  //       [Number(pid)]
  //     );
  //   }
  return await conn.execute(`INSERT into COMMENT (user, post, pid, content) values (${USER_NUMBER}, ?, ?, ?)`, [
    Number(postId),
    Number(pid) ? Number(pid) : null,
    content,
  ]);
}
export async function update(conn, content, commentId) {
  return conn.execute(`UPDATE COMMENT set content = ? WHERE COMMENT.id = ?`, [content, Number(commentId)]);
}
export async function remove(conn, commentId) {
  if (commentId !== null) {
    await conn.execute(`DELETE FROM COMMENT WHERE pid = ?`, [Number(commentId)]);
  }
  await conn.execute(`DELETE FROM COMMENT WHERE id = ?`, [Number(commentId)]);
}

export async function getParentComments(conn, postId) {
  return conn
    .execute('SELECT * FROM COMMENT WHERE COMMENT.pid is null and COMMENT.post = ?', [postId])
    .then((result) => result[0]);
}

export async function getChildComments(conn, postId) {
  return conn
    .execute('SELECT * FROM COMMENT WHERE COMMENT.post = ? and COMMENT.pid is not null', [postId])
    .then((result) => result[0]);
}
