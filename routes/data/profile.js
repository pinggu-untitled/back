export async function updateProfileInfo(conn, user) {
  await conn.execute('UPDATE USER SET nickname = ?, bio = ?, profile_image_url = ? WHERE id = ?', [user.nickname, user.bio, user.profile_image_url, Number(user.id)]);
}