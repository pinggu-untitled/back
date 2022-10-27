export async function getAll(conn, postId) {
  return conn.execute(`SELECT * FROM COMMENT WHERE COMMENT.post = ?`, [Number(postId)]).then((result) => result[0]);
}
export async function create(conn, userId, pid, postId, content, hashtags, mentions) {
  const newComment = await conn
    .execute(`INSERT into COMMENT (user, post, pid, content) values (?, ?, ?, ?)`, [
      Number(userId),
      Number(postId),
      Number(pid) ? Number(pid) : null,
      content,
    ])
    .then((res) => getComment(conn, res[0].insertId));
  if (hashtags && hashtags.length !== 0) {
    for (const hashtag of hashtags) {
      const hashExist = await conn
        .execute(`SELECT COUNT(*) as count FROM HASHTAG WHERE content = '${hashtag.content}'`)
        .then((result) => result[0][0].count);

      if (hashExist === 0) {
        await conn.execute(`INSERT into HASHTAG (content) values (?)`, [hashtag.content]);
      }

      const hashtagId = await conn
        .execute(`SELECT id FROM HASHTAG WHERE content = ?`, [hashtag.content])
        .then((result) => result[0][0]);
      await conn.execute(`INSERT into COMMENTHASH (comment, hash) values (?, ?)`, [
        Number(newComment.id),
        Number(hashtagId.id),
      ]);
    }
  }
  if (mentions && mentions.length !== 0) {
    for (const mention of mentions) {
      await conn.execute(`INSERT into MENTION (comment, sender, receiver) values (?, ?, ?)`, [
        Number(newComment.id),
        Number(userId),
        Number(mention.receiver),
      ]);
    }
  }
  return newComment;
}
// export async function create(conn, userId, pid, postId, content) {
//   return await conn
//     .execute(`INSERT into COMMENT (user, post, pid, content) values (?, ?, ?, ?)`, [
//       Number(userId),
//       Number(postId),
//       Number(pid) ? Number(pid) : null,
//       content,
//     ])
//     .then((res) => res[0].insertId);
// }
export async function update(conn, userId, content, commentId, mentions, hashtags) {
  const updateComment = await conn
    .execute(`UPDATE COMMENT set content = ? WHERE COMMENT.id = ?`, [content, Number(commentId)])
    .then((res) => getComment(conn, commentId))
    .catch(console.error);
  console.log(updateComment);
  await conn.execute(`DELETE FROM MENTION as mt WHERE mt.comment = ?`, [Number(commentId)]);
  await conn.execute('DELETE FROM COMMENTHASH as ch WHERE ch.comment = ?', [Number(commentId)]);
  if (hashtags && hashtags.length !== 0) {
    for (const hashtag of hashtags) {
      const hashExist = await conn
        .execute(`SELECT COUNT(*) as count FROM HASHTAG WHERE content = '${hashtag.content}'`)
        .then((result) => result[0][0].count);

      if (hashExist === 0) {
        await conn.execute(`INSERT into HASHTAG (content) values (?)`, [hashtag.content]);
      }

      const hashtagId = await conn
        .execute(`SELECT id FROM HASHTAG WHERE content = ?`, [hashtag.content])
        .then((result) => result[0][0]);
      await conn.execute(`INSERT into COMMENTHASH (comment, hash) values (?, ?)`, [
        Number(updateComment.id),
        Number(hashtagId.id),
      ]);
    }
  }
  if (mentions && mentions.length !== 0) {
    for (const mention of mentions) {
      await conn.execute(`INSERT into MENTION (comment, sender, receiver) values (?, ?, ?)`, [
        Number(updateComment.id),
        Number(userId),
        Number(mention.receiver),
      ]);
    }
  }
  return updateComment;
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

export async function getComment(conn, commentId) {
  return conn
    .execute('SELECT cm.id, cm.content, cm.pid, cm.created_at, cm.updated_at FROM COMMENT as cm WHERE cm.id = ?', [
      Number(commentId),
    ])
    .then((result) => result[0][0]);
}
