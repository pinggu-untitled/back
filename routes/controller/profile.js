import { db } from '../../config/mysql.js';
import { profileRepository } from '../data/index.js';
import {unlink} from 'fs';
import { resolve } from 'path';

const deleteFile = file => new Promise(resolve, reject => {
  // console.log('deleteFile() file :>> ', file);
  unlink(file, err => {
    if (err) reject(err);
  })
  resolve(true);
})

export async function updateProfileInfo(req, res, next) {
  // test 값 박아놓은 것.
  const TMPUSER = {
    id: 17,
    nickname: '2438690663',
    profile_image_url: 'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg',
  }

  req.user = TMPUSER;
  req.user.id = 17;
  req.session.passport = {};
  req.session.passport.user = {
    id: 17,
    nickname: '2438690663',
    profile_image_url: 'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg',
  }
  // test 값 끝

  const NEW_USER = {
    id: req.user.id,
    nickname: req.body.nickname,
    bio: req.body.bio,
    profile_image_url: req.body.profile_image_url,
  }

  // console.log('NEW_USER :>> ', NEW_USER);
  // console.log('req.session.passport.user.profile_image_url :>> ', req.session.passport.user.profile_image_url);

  const isImage = req.session.passport.user.profile_image_url.indexOf('/https|http/') < 0; // 기존 프로필 사진이 이미지일 경우 true
  // return res.status(201).json();

  const conn = await db.getConnection();
  try {

    const result = await profileRepository.updateProfileInfo(conn, NEW_USER);

    // session 정보 변경
    req.session.passport.user.nickname = NEW_USER.nickname;
    req.session.passport.user.profile_image_url = NEW_USER.profile_image_url;

    console.log('req.session.passport.user.nickname :>> ', req.session.passport.user.nickname);
    console.log('req.session.passport.user.profile_image_url :>> ', req.session.passport.user.profile_image_url);

    console.log('isImage11 :>> ', isImage);
    console.log('fs.existsSync(NEW_USER.profile_image_url)11 :>> ', fs.existsSync(NEW_USER.profile_image_url));
    if (isImage && fs.existsSync(NEW_USER.profile_image_url)) {
      console.log('isImage22 :>> ', isImage);
      console.log('fs.existsSync(NEW_USER.profile_image_url)22 :>> ', fs.existsSync(NEW_USER.profile_image_url));

      // promise로 바꾸기 221006
      const deleteRes = await deleteFile(NEW_USER.profile_image_url);
      if(!deleteRes) {
        console.log('failed file name : ', NEW_USER.profile_image_url);
        throw new Error('delete file fail!!!');
      }
    }

    return res.status(200).json();

  } catch (err) {
    return res.status(500).json(err);
  } finally {
    conn.release();
  }
}

export async function updateProfileImage(req, res, next) {
  return res.status(200).json(req.file.filename);
}