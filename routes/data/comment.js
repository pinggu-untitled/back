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
  return await conn
    .execute(`INSERT into COMMENT (user, post, pid, content) values (${USER_NUMBER}, ?, ?, ?)`, [
      Number(postId),
      Number(pid) ? Number(pid) : null,
      content,
    ])
    .then((res) => res[0].insertId);
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
    .execute(
      'SELECT cm.id, cm.content, cm.pid, cm.created_at, cm.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM COMMENT as cm join USER as us on cm.user = us.id WHERE cm.pid is null and cm.post = ?',
      [Number(postId)],
    )
    .then((result) => result[0]);
}

export async function getChildComments(conn, postId) {
  return conn
    .execute(
      'SELECT cm.id, cm.content, cm.pid, cm.created_at, cm.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM COMMENT as cm join USER as us on cm.user = us.id WHERE cm.post = ? and cm.pid is not null',
      [Number(postId)],
    )
    .then((result) => result[0]);
}
