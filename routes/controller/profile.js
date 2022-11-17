import { db } from '../../config/mysql.js';
import { profileRepository } from '../data/index.js';
import { existsSync, unlinkSync } from 'fs';

export async function updateProfileInfo(req, res, next) {
  // test 값 박아놓은 것.
  // const TMP_USER = {
  //   id: 17,
  //   nickname: '2438690663',
  //   profile_image_url: '4af870f7e97036b99b3573c35d530ea9.png',
  // }

  // req.user = TMP_USER;
  // req.user.id = 17;
  // req.session.passport = {};
  // req.session.passport.user = {
  //   id: 17,
  //   nickname: '2438690663',
  //   profile_image_url: '4af870f7e97036b99b3573c35d530ea9.png',
  // }
  // test 값 끝

  // 변경사항이 하나도 없는데 호출되었을 때
  if (!req.body.nickname && !req.body.bio && !req.body.profile_image_url) return res.status(400).json(err);

  const NEW_USER = {
    id: req.user.id,
    nickname: req.body.nickname,
    bio: req.body.bio,
    profile_image_url: req.body.profile_image_url,
  };

  let p_img_orig = req.session.passport.user.profile_image_url;
  const isImage = p_img_orig.indexOf('/https|http/') < 0; // 기존 프로필 사진이 이미지일 경우 true, 링크일 경우 false

  const conn = await db.getConnection();
  try {
    const result = await profileRepository.updateProfileInfo(conn, NEW_USER);
    p_img_orig = 'uploads/images/profile/' + p_img_orig;
    if (isImage && existsSync(p_img_orig)) {
      unlinkSync(p_img_orig, (err) => {
        throw new Error(err);
      });
    }

    // session 정보 변경
    req.session.passport.user.nickname = NEW_USER.nickname;
    req.session.passport.user.profile_image_url = NEW_USER.profile_image_url;
    console.log('hello@@@');
    return res.status(200).json(NEW_USER);
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function updateProfileImage(req, res, next) {
  return res.status(200).json(req.file.filename);
}
