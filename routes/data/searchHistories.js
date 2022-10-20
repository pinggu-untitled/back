export async function getAll(conn, userId) {
  return await conn
    .execute(
      `SELECT sh.id, sh.updated_at, s.content FROM SEARCHHISTORY as sh join SEARCH as s on sh.search = s.id WHERE sh.user = ? ORDER BY sh.updated_at desc;`,
      [Number(userId)],
    )
    .then((res) => res[0]);
}

export async function create(conn, userId, content) {
  let searchId = await conn
    .execute('INSERT ignore INTO SEARCH (content) values (?)', [content])
    .then((res) => res[0].insertId);
  if (!searchId) {
    searchId = await conn.execute('SELECT id from SEARCH WHERE content = ?', [content]).then((res) => res[0][0].id);
  }

  try {
    await conn.execute('INSERT INTO SEARCHHISTORY (user, search) values (?, ?)', [Number(userId), searchId]);
  } catch (err) {
    await conn.execute('UPDATE SEARCHHISTORY SET updated_at = NOW() WHERE user = ? and search = ?', [
      Number(userId),
      searchId,
    ]);
  }
}

export async function remove(conn, userId) {
  await conn.execute(`DELETE FROM SEARCHHISTORY as sh WHERE sh.user = ?`, [Number(userId)]);
}
export async function removeById(conn, userId, historyId) {
  await conn.execute(`DELETE FROM SEARCHHISTORY as sh WHERE sh.id = ? and sh.user = ?`, [historyId, Number(userId)]);
}
export async function getPopular(conn) {
  return await conn
    .execute(
      `SELECT s.content, count(*) as count FROM SEARCHHISTORY as sh join SEARCH as s on sh.search = s.id group by s.content order by count desc limit 10`,
    )
    .then((res) => res[0]);
}
