import { USER_NUMBER } from '../controller/posts.js';
import * as fileRepository from './file.js';

// 모든 게시물
export async function getAll(conn) {
  return conn
    .execute(
      'SELECT po.id, po.user, po.created_at, po.updated_at, po.title, po.content, po.longitude, po.latitude, po.hits, us.nickname FROM POST as po join USER as us on po.user = us.id ORDER BY po.created_at desc',
    )
    .then((result) => result[0]);
}
// follwing 한 사람들 게시물로 조건 걸기
export async function getFollwing(conn) {
  return conn
    .execute(
      'SELECT po.id, po.user, po.created_at, po.title, po.content, po.longitude, po.latitude, po.hits, us.nickname, us.profile_image_url FROM POST as po join USER as us on po.user = us.id where po.user in (SELECT distinct fo.follow from FOLLOW as fo where fo.host = 1) ORDER BY po.created_at desc',
    )
    .then((result) => result[0]);
}

// 댓글, 멘션도 같이 넘겨주기
export async function getById(conn, postId) {
  conn.execute('UPDATE POST SET hits = hits + 1 where id = ?', [postId]);
  return conn //
    .execute(
      'SELECT po.id, po.user, po.created_at, po.updated_at, po.title, po.content, po.longitude, po.latitude, po.hits, us.nickname, us.profile_image_url FROM POST as po join USER as us on po.user = us.id WHERE po.id = ? ORDER BY po.created_at desc',
      [postId],
    )
    .then((result) => result[0][0]);
}

export async function create(conn, post, mentions, hashtags, images) {
  const newPost = await conn
    .execute(
      `INSERT into POST (user, title, content, longitude, latitude, is_private) values (${USER_NUMBER}, ?, ?, ?, ?, ?)`,
      [post.title, post.content, post.longitude, post.latitude, post.is_private ? 1 : 0],
    )
    .then((result) => getById(conn, result[0].insertId));

  for (const hashtag of hashtags) {
    hashtag;
    const hashExist = await conn
      .execute(`SELECT COUNT(*) as count FROM HASHTAG WHERE content = '${hashtag.content}'`)
      .then((result) => result[0][0].count);

    if (hashExist === 0) {
      await conn.execute(`INSERT into HASHTAG (content) values (?)`, [hashtag.content]);
    }

    const hashtagId = await conn
      .execute(`SELECT id FROM HASHTAG WHERE content = ?`, [hashtag.content])
      .then((result) => result[0][0]);

    await conn.execute(`INSERT into POSTHASH (post, hash) values (?, ?)`, [Number(newPost.id), Number(hashtagId.id)]);
  }

  for (const mention of mentions) {
    await conn.execute(`INSERT into MENTION (post, sender, receiver) values (?, ?, ?)`, [
      Number(newPost.id),
      Number(USER_NUMBER),
      Number(mention.receiver),
    ]);
  }
  if (images) {
    images.map(async (image) => {
      await fileRepository.create(conn, image, newPost.id);
    });
  }
  return newPost;
}

// export async function createMedia(conn, files, postId) {}

export async function update(conn, post, mentions, hashtags, postId, files) {
  const updatePost = await conn
    .execute(`UPDATE POST set title = ?, content = ?, longitude = ?, latitude = ?, is_private = ? WHERE id = ?`, [
      post.title,
      post.content,
      post.longitude,
      post.latitude,
      post.is_private ? 1 : 0,
      postId,
    ])
    .then(() => getById(conn, postId));

  await conn.execute(`DELETE FROM MENTION WHERE MENTION.post = ?`, [Number(postId)]);
  await conn.execute('DELETE FROM POSTHASH WHERE post = ?', [Number(postId)]);

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
    await conn.execute(`INSERT into POSTHASH (post, hash) values (?, ?)`, [Number(postId), Number(hashtagId.id)]);
  }

  for (const mention of mentions) {
    await conn.execute(`INSERT into MENTION (post, sender, receiver) values (?, ?, ?)`, [
      Number(postId),
      USER_NUMBER,
      Number(mention.receiver),
    ]);
  }

  return updatePost;
}

export async function remove(conn, postId) {
  // await conn.execute(
  //   `DELETE FROM MENTION WHERE MENTION.post = (SELECT POST.user FROM POST WHERE POST.id = ?)`,
  //   [Number(postId)]
  // );
  await conn.execute('DELETE FROM POST WHERE id = ?', [Number(postId)]);
  // await conn.execute('DELETE FROM POSTHASH WHERE post = ?', [Number(postId)]);
}
