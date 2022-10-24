export async function updateProfileInfo(conn, user) {
  let query = 'UPDATE USER SET';
  const param = [];

  // 수정사항 있는 항목만 변경
  if (user.nickname) {
    query = query.concat(' nickname = ?,');
    param.push(user.nickname);
  }
  if (user.bio) {
    query = query.concat(' bio = ?,');
    param.push(user.bio);
  }
  if (user.profile_image_url) {
    query = query.concat(' profile_image_url = ?,');
    param.push(user.profile_image_url);
  }

  query = query.substring(0, query.length - 1); // , 빼기
  
  query = query.concat(' where id = ?;');
  param.push(user.id);

  return conn.execute(query, param);
}