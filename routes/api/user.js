import { Router } from 'express';
import Sequelize from 'sequelize';
import db from '../../models/index.js';
const { User, Post, Media, MyPings, MyPingsPost, SharePings, sequelize } = db;
const { QueryTypes } = sequelize;
const { Op } = Sequelize;

const router = Router();

/* 세션에 저장된 사용자 정보 가져오기 */
router.get('/me', (req, res) => {
  if (req.user?.id) {
    res.status(200).json(req.session.passport.user);
  }
  else
    res.status(500).json(null);
});

/* 모든 사용자 정보 가져오기 */
router.get('/all', (req, res) => {
  User.findAll({ attributes: ['id', 'nickname', 'profile_image_url']})
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
})

/* 사용자 정보 가져오기 */
router.get('/:userId', (req, res) => {
  User.findOne({
    where: { id: req.params.userId },
    attributes: ['id', 'nickname', 'bio', 'profile_image_url']
  })
  .then(user => {
    if (user === null) throw new Error('사용자를 찾을 수 없음')
    res.status(200).json(user)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'fail'});
  });
});


/* 팔로워 목록 가져오기 */
router.get('/:userId/followers', async (req, res) => {
  const query = 'SELECT USER.id, USER.nickname, USER.profile_image_url FROM USER INNER JOIN FOLLOW ON (FOLLOW.host=USER.id) WHERE FOLLOW.follow=:userId';
  try {
    const followers = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { userId: req.params.userId }
    });
    res.status(200).json(followers);
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'fail'});
  }
});

/* 팔로잉 목록 가져오기 */
router.get('/:userId/followings', async (req, res) => {
  const query = 'SELECT USER.id, USER.nickname, USER.profile_image_url FROM USER INNER JOIN FOLLOW ON (FOLLOW.follow=USER.id) WHERE FOLLOW.host=?';
  try {
    const followings = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [req.params.userId]
    });
    res.status(200).json(followings);
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'fail'});
  }
});


/* 사용자의 마이핑스 전체 목록 가져오기 */
router.get('/:userId/mypings', (req, res) => {
  MyPings.findAll({
    where: {
      user: req.params.userId
    },
    attributes: ['id', 'title', 'category', 'user', 'is_private']
  })
  .then(mypings => {
    res.status(200).json(mypings);
  })
  .catch(err => {
    res.status(500).json({message: 'fail'});
  });
});

/* 사용의 특정 마이핑스 가져오기 */
router.get('/:userId/mypings/:mypingsId', (req, res) => {
  MyPings.findOne({
    where: {
      id: req.params.mypingsId,
      user: req.params.userId
    },
    attributes: ['id', 'title', 'category', 'user', 'is_private']
  })
  .then(mypings => {
    res.status(200).json(mypings);
  })
  .catch(err => {
    res.status(500).json({message: 'fail'});
  });
});

/* 공유된 마이핑스 가져오기 */
router.get('/:userId/sharepings', async (req, res) => {
  try {
    const sharedArray = await SharePings.findAll({
      where: {
        guest: req.params.userId
      },
      attributes: ['mypings']
    });
    const sharedIdArray = sharedArray.map(sharedObj => sharedObj.mypings);

    const mypings = await MyPings.findAll({
      where: {
        id: { [Op.in]: sharedIdArray }
      },
      attributes: ['id', 'title', 'category', 'user', 'is_private']
    });
    res.status(200).json(mypings);
  } catch(err) {
    console.log(err);
    res.status(500).json({message: 'fail'});
  }
});

/* 내 혹은 유저의 포스트 전체 목록 가져오기  */
router.get('/:userId/posts', (req, res) => {
  Post.findAll({
    include: [{
      model: Media,
      attributes: ['src'],
      limit: 1
    }],
    attributes: ['id', 'created_at', 'title', 'hits', 'is_private'],
    where: { user: req.params.userId }
  })
  .then(posts => res.status(200).json(posts))
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'fail'});
  });
});

/* 특정 마이핑스에 속한 포스트 목록 가져오기 */
router.get('/:userId/mypings/:mypingsId/posts', async (req, res) => {
  try {
    const postArray = await MyPingsPost.findAll({
      where: {
        mypings: req.params.mypingsId
      },
      attributes: ['post']
    });
    const postIdArray = postArray.map(postObj => postObj.post);

    const posts = await Post.findAll({
      include: [{
        model: Media,
        attributes: ['src'],
        limit: 1
      }],
      where: {
        id: {
          [Op.in]: postIdArray
        }
      },
      attributes: ['id', 'created_at', 'title', 'hits', 'is_private']
    });
    res.status(200).json(posts);
  } catch(err) {
    console.log(err);
    res.status(500).json({message: 'fail'});
  }
});

export default router;