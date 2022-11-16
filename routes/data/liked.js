export async function getByIds(conn, ids) {
  return conn
    .execute(
      `SELECT li.user as id, li.post as post, us.nickname, us.profile_image_url FROM LIKED as li join USER as us on li.user = us.id WHERE li.post in (?) ORDER BY li.created_at`,
      [ids],
    )
    .then((result) => result[0]);
}
export async function getAll(conn, postId) {
  return conn
    .execute(
      `SELECT li.user as id, us.nickname, us.profile_image_url FROM LIKED as li join USER as us on li.user = us.id WHERE li.post = ? ORDER BY li.created_at`,
      [Number(postId)],
    )
    .then((result) => result[0]);
}




export async function create(conn, postId, userId) {
  return conn.execute('INSERT into LIKED (post, user) values (?, ?)', [Number(postId), userId]);
}
export async function remove(conn, postId, userId) {
  return conn.execute('DELETE FROM LIKED WHERE post = ? and user = ?', [Number(postId), userId]);
}
