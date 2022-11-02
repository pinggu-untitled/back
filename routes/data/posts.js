import * as fileRepository from './file.js';

// 모든 게시물
export async function getAll(conn) {
  return conn
    .execute(
      'SELECT po.id, po.user, po.created_at, po.updated_at, po.title, po.content, po.longitude, po.latitude, po.hits, po.is_private, us.id as userId, us.nickname, us.profile_image_url FROM POST as po join USER as us on po.user = us.id ORDER BY po.created_at desc',
    )
    .then((result) => result[0]);
}
// follwing 한 사람들 게시물 쿼리
export async function getFollowing(conn, userId) {
  return conn
    .execute(
      'SELECT po.id, po.title, po.content, po.longitude, po.latitude, po.hits, po.is_private, po.created_at, po.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as po join USER as us on po.user = us.id where po.user in (SELECT distinct fo.follow from FOLLOW as fo where fo.host = ?) or po.user = ? ORDER BY po.created_at desc',
      [Number(userId), Number(userId)],
    )
    .then((result) => result[0]);
}

// 특정 게시물 쿼리
export async function getById(conn, postId) {
  return conn //
    .execute(
      'SELECT po.id, po.title, po.content, po.longitude, po.latitude, po.hits, po.is_private,  po.created_at, po.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as po join USER as us on po.user = us.id WHERE po.id = ? ORDER BY po.created_at desc',
      [Number(postId)],
    )
    .then((result) => result[0][0]);
}

// 게시물 생성 쿼리
export async function create(conn, userId, post, mentions, hashtags, images) {
  const newPost = await conn
    .execute(`INSERT into POST (user, title, content, longitude, latitude, is_private) values (?, ?, ?, ?, ?, ?)`, [
      Number(userId),
      post.title,
      post.content.trim() === '' ? null : post.content,
      post.longitude,
      post.latitude,
      post.is_private ? 1 : 0,
    ])
    .then((result) => getById(conn, result[0].insertId));

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
      await conn.execute(`INSERT into POSTHASH (post, hash) values (?, ?)`, [Number(newPost.id), Number(hashtagId.id)]);
    }
  }
  if (mentions && mentions.length !== 0) {
    for (const mention of mentions) {
      await conn.execute(`INSERT into MENTION (post, sender, receiver) values (?, ?, ?)`, [
        Number(newPost.id),
        Number(userId),
        Number(mention.receiver),
      ]);
    }
  }
  if (images.length !== 0) {
    images.map(async (image) => {
      await fileRepository.create(conn, userId, image, newPost.id);
    });
  }
  return newPost;
}

// 특정 게시물 수정
export async function update(conn, userId, postId, post, mentions, hashtags, images) {
  const updatePost = await conn
    .execute(`UPDATE POST SET title = ?, content = ?, longitude = ?, latitude = ?, is_private = ? WHERE id = ?`, [
      post.title,
      post.content.trim() === '' ? null : post.content,
      post.longitude,
      post.latitude,
      post.is_private ? 1 : 0,
      postId,
    ])
    .then((result) => getById(conn, postId))
    .catch(console.error);

  await conn.execute(`DELETE FROM MENTION WHERE MENTION.post = ?`, [Number(postId)]);
  await conn.execute('DELETE FROM POSTHASH WHERE post = ?', [Number(postId)]);

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
      await conn.execute(`INSERT into POSTHASH (post, hash) values (?, ?)`, [
        Number(updatePost.id),
        Number(hashtagId.id),
      ]);
    }
  }
  if (mentions && mentions.length !== 0) {
    for (const mention of mentions) {
      await conn.execute(`INSERT into MENTION (post, sender, receiver) values (?, ?, ?)`, [
        Number(updatePost.id),
        Number(userId),
        Number(mention.receiver),
      ]);
    }
  }
  if (images?.length !== 0) {
    await conn.execute('UPDATE MEDIA as md SET md.post = null WHERE md.post = ?', [postId]);
    images?.map(async (image) => {
      await fileRepository.create(conn, userId, image, updatePost.id);
    });
  } else {
    await conn.execute('UPDATE MEDIA as md SET md.post = null WHERE md.post = ?', [Number(postId)]);
  }

  return updatePost;
}

// 특정 게시물 삭제
export async function remove(conn, postId) {
  await conn.execute('DELETE FROM POST WHERE id = ?', [Number(postId)]).catch(console.error);
  await conn.execute('UPDATE MEDIA SET post = null where post = ?', [Number(postId)]).catch(console.error);
}

// 게시물 해시태그 가져오기
export async function getPostHashTags(conn, postId) {
  const result = await conn
    .execute(`SELECT ht.id, ht.content FROM POSTHASH as ph join HASHTAG ht on ph.hash = ht.id where ph.post = ?`, [
      Number(postId),
    ])
    .then((res) => res[0])
    .catch(console.error);
  return result;
}

// 게시물 멘션 가져오기
export async function getPostMentions(conn, userId, postId) {
  const data = await conn
    .execute(`select mt.id, mt.sender, mt.receiver from MENTION as mt where mt.post = ? and comment is null`, [
      Number(postId),
    ])
    .then((res) => res[0])
    .catch(console.error);

  const sender = await conn
    .execute(`select us.id, us.nickname, us.profile_image_url from USER as us where us.id = ?`, [Number(userId)])
    .then((res) => res[0][0]);
  const result = await Promise.all(
    data.map(async (el) => {
      el.sender = sender;
      el.receiver = await conn
        .execute(`select us.id, us.nickname, us.profile_image_url from USER as us where us.id = ?`, [
          Number(el.receiver),
        ])
        .then((res) => res[0][0])
        .catch(console.error);
      return el;
    }),
  );
  return result;
}

export async function updateHits(conn, postId) {
  conn.execute('UPDATE POST SET hits = hits + 1 where id = ?', [Number(postId)]);
}

export async function getByBounds(conn, userId, swLat, neLat, swLng, neLng) {
  return conn
    .execute(
      'SELECT po.id, po.title, po.content, po.longitude, po.latitude, po.hits, po.is_private, po.created_at, po.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as po join USER as us on po.user = us.id where ((po.user in (SELECT distinct fo.follow from FOLLOW as fo where fo.host = ?) and po.is_private = 0) or po.user = ?) and ((po.latitude between ? and ?) and (po.longitude between ? and ?))',
      [Number(userId), Number(userId), swLat, neLat, swLng, neLng],
    )
    .then((result) => result[0]);
}
