import { Router } from 'express';
import Sequelize from 'sequelize';
import url from 'url';
import db from '../../models/index.js';
const { User, Post, Media, MyPings, SharePings, sequelize } = db;
const { QueryTypes } = sequelize;
const { Op } = Sequelize;

const router = Router();

/* 세션에 저장된 사용자 정보 가져오기 */
router.get('/me', (req, res) => {
  if (req.user?.id) {
    res.status(200).json(req.session.passport.user);
  } else res.status(500).json(null);
});

/* 모든 사용자 정보 가져오기 */
router.get('/all', (req, res) => {
  User.findAll({ attributes: ['id', 'nickname', 'profile_image_url'] })
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 사용자 정보 가져오기 */
router.get('/:userId', (req, res) => {
  User.findOne({
    where: { id: req.params.userId },
    attributes: ['id', 'nickname', 'bio', 'profile_image_url'],
  })
    .then((user) => {
      user ? res.status(200).json(user) : res.status(404).json({ message: '존재하지 않는 사용자입니다.' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 팔로워 목록 가져오기 */
router.get('/:userId/followers', (req, res) => {
  const query =
    'SELECT USER.id, USER.nickname, USER.profile_image_url FROM USER INNER JOIN FOLLOW ON (FOLLOW.host=USER.id) WHERE FOLLOW.follow=:userId';
  sequelize
    .query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: req.params.userId },
    })
    .then((followers) => res.status(200).json(followers))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 팔로잉 목록 가져오기 */
router.get('/:userId/followings', (req, res) => {
  const query =
    'SELECT USER.id, USER.nickname, USER.profile_image_url FROM USER INNER JOIN FOLLOW ON (FOLLOW.follow=USER.id) WHERE FOLLOW.host=?';
  sequelize
    .query(query, {
      type: QueryTypes.SELECT,
      replacements: [req.params.userId],
    })
    .then((followings) => res.status(200).json(followings))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 사용자의 마이핑스 전체 목록 가져오기 */
router.get('/:userId/mypings', (req, res) => {
  MyPings.findAll({
    include: [
      {
        model: User,
        as: 'User',
        attributes: ['id', 'nickname', 'profile_image_url'],
      },
    ],
    where: {
      user: req.params.userId,
    },
    attributes: ['id', 'title', 'category', 'is_private'],
    order: [['created_at', 'DESC']],
  })
    .then((mypings) => res.status(200).json(mypings))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 공유된 마이핑스 가져오기 */
router.get('/:userId/sharepings', (req, res) => {
  SharePings.findAll({ where: { guest: req.params.userId }, attributes: ['mypings'] })
    .then((sharedArray) => sharedArray.map((sharedObj) => sharedObj.mypings))
    .then((sharedIdArray) =>
      MyPings.findAll({
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['id', 'nickname', 'profile_image_url'],
          },
        ],
        where: { id: { [Op.in]: sharedIdArray } },
        attributes: ['id', 'title', 'category', 'is_private'],
        order: [['created_at', 'DESC']],
      }),
    )
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 내 혹은 유저의 포스트 전체 목록 가져오기  */
router.get('/:userId/posts', (req, res) => {
  Post.findAll({
    include: [
      {
        model: Media,
        as: 'Images',
        attributes: ['id', 'src'],
      },
      {
        model: User,
        attributes: ['id', 'nickname', 'profile_image_url'],
      },
    ],
    attributes: ['id', 'created_at', 'updated_at', 'title', 'content', 'latitude', 'longitude', 'hits', 'is_private'],
    where: { user: req.params.userId },
    order: [['created_at', 'DESC']],
  })
    .then((posts) => res.status(200).json(posts))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* Test - 지도 범위 내 포스트 가져오기 */
router.get('/posts/bounds', (req, res) => {
  const {
    query: { swLat, swLng, neLat, neLng },
  } = url.parse(req.originalUrl, true);
  console.log(swLat, swLng, neLat, neLng);

  Post.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'nickname', 'profile_image_url'],
      },
      {
        model: Media,
        as: 'Images',
        attributes: ['id', 'src'],
      },
    ],
    where: {
      latitude: { [Op.between]: [swLat, neLat] },
      longitude: { [Op.between]: [swLng, neLng] },
      [Op.or]: [{ user: req.user.id }, { is_private: 0 }],
    },
    attributes: ['id', 'created_at', 'updated_at', 'title', 'content', 'latitude', 'longitude', 'hits', 'is_private'],
  })
    .then((posts) => res.status(200).json(posts))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

export default router;
