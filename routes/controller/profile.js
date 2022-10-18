import { db } from '../../config/mysql.js';
import { profileRepository } from '../data/index.js';

export async function updateProfileInfo(req, res, next) {
  const NEW_USER = {
    id: req.user.id,
    nickname: req.param.nickname,
    bio: req.param.bio,
  }

  // req.session.passport.user; // 세션에 user객체
  const conn = await db.getConnection();
  try {
    // bio에 helmet으로 보안 체크

    console.log('update 시작');
    const res = await profileRepository.updateProfileInfo(conn, NEW_USER);
    console.log('update 성공');
    req.session.passport.user.nickname = NEW_USER.nickname;

  } catch (e) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function updateProfileImage(req, res, next) {
  const isImage = req.session.passport.user.profile_image_url.indexOf('/https|http/') < 0; // 프로토콜이 http https 일 경우 false

  // 기존 이미지가 url일 경우, 파일 생성 후 DB 업데이트
    
  // 기존 이미지가 Image 일 경우, 기존 파일 삭제 / 생성 후 DB 업데이트

  const conn = await db.getConnection();
  try {
    
  } catch (e) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}