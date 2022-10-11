export async function getPostByTitle(conn, query) {
  return await conn
    .execute(
      `SELECT ps.id, ps.title, ps.content, ps.longitude, ps.latitude, ps.hits, ps.is_private, ps.created_at, ps.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as ps join USER as us on ps.user = us.id WHERE ps.title like '%${query}%'`,
    )
    .then((res) => res[0])
    .then((res) => {
      return res.map((item) => {
        const { userId, nickname, profile_image_url } = item;
        delete item.userId;
        delete item.nickname;
        delete item.profile_image_url;
        return {
          ...item,
          User: {
            id: userId,
            nickname,
            profile_image_url,
          },
        };
      });
    });
}

export async function getMyPingsByTitle(conn, query) {
  return await conn
    .execute(
      `SELECT mp.id, mp.title, mp.category, mp.is_private, mp.created_at, mp.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM MYPINGS as mp join USER as us on us.id = mp.user WHERE mp.title like '%${query}%'`,
    )
    .then((res) => res[0])
    .then((res) => {
      return res.map((item) => {
        const { userId, nickname, profile_image_url } = item;
        delete item.userId;
        delete item.nickname;
        delete item.profile_image_url;
        return {
          ...item,
          User: {
            id: userId,
            nickname,
            profile_image_url,
          },
        };
      });
    });
}

export async function getPostByContent(conn, query) {
  return await conn
    .execute(
      `SELECT ps.id, ps.title, ps.content, ps.longitude, ps.latitude, ps.hits, ps.is_private, ps.created_at, ps.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as ps join USER as us on ps.user = us.id WHERE ps.content like '%${query}%'`,
    )
    .then((res) => res[0])
    .then((res) => {
      return res.map((item) => {
        const { userId, nickname, profile_image_url } = item;
        delete item.userId;
        delete item.nickname;
        delete item.profile_image_url;
        return {
          ...item,
          User: {
            id: userId,
            nickname,
            profile_image_url,
          },
        };
      });
    });
}

export async function getUserByNickname(conn, query) {
  return await conn
    .execute(`SELECT us.id, us.nickname, us.profile_image_url FROM USER as us WHERE us.nickname like '%${query}%'`)
    .then((res) => res[0]);
}

export async function getMyPingsByCategory(conn, query) {
  return await conn
    .execute(
      `SELECT mp.id, mp.title, mp.category, mp.is_private, us.id as userId, us.nickname, us.profile_image_url from MYPINGS as mp join USER as us on us.id = mp.user WHERE mp.category = ?`,
      [query],
    )
    .then((res) => res[0])
    .then((res) => {
      return res.map((item) => {
        const { userId, nickname, profile_image_url } = item;
        delete item.userId;
        delete item.nickname;
        delete item.profile_image_url;
        return {
          ...item,
          User: {
            id: userId,
            nickname,
            profile_image_url,
          },
        };
      });
    });
}

export async function getPostByHashtag(conn, query) {
  return await conn
    .execute(
      `SELECT ps.id, ps.title, ps.content, ps.longitude, ps.latitude, ps.hits, ps.is_private, ps.created_at, ps.updated_at, us.id as userId, us.nickname, us.profile_image_url 
	FROM POST as ps 
    join USER as us 
    on ps.user = us.id
    WHERE ps.id in 
    (select ph.post from HASHTAG as ht 
	join POSTHASH as ph 
    on ht.id = ph.hash 
    WHERE content like '%${query}%');`,
    )
    .then((res) => res[0])
    .then((res) => {
      return res.map((item) => {
        const { userId, nickname, profile_image_url } = item;
        delete item.userId;
        delete item.nickname;
        delete item.profile_image_url;
        return {
          ...item,
          User: {
            id: userId,
            nickname,
            profile_image_url,
          },
        };
      });
    });
}
