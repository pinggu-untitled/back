import express from 'express';
import Sequelize from 'sequelize';
import db from '../../models/index.js';
import { isAccessible } from '../middlewares/accessible.js';
import { isPrivate } from '../middlewares/private.js';
const { MyPings, SharePings, MyPingsPost, Post, User, Media, Liked, sequelize } = db;
const { Op } = Sequelize;

const router = express.Router();

/* 사용의 특정 마이핑스 가져오기 */
router.get('/:mypingsId', isPrivate, (req, res) => {
  MyPings.findOne({
    include: [
      {
        model: User,
        as: 'User',
        attributes: ['id', 'nickname', 'profile_image_url'],
      },
    ],
    where: {
      id: req.params.mypingsId,
    },
    attributes: ['id', 'title', 'category', 'is_private'],
  })
    .then((mypings) => {
      console.log('mypings>> ', mypings);
      mypings ? res.status(200).json(mypings) : res.status(404).json({ message: '조회된 마이핑스가 없습니다.' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 마이핑스 공유하기 */
router.post('/:mypingsId/sharepings', (req, res) => {
  MyPings.findOne({ where: { id: req.params.mypingsId, is_private: 0 }, attributes: ['user'] })
    .then((userObj) => {
      if (!userObj || userObj.dataValues?.user === req.user?.id) throw new Error('해당 마이핑스를 공유할 수 없습니다.');
      SharePings.create({
        host: userObj.dataValues?.user,
        guest: req.user?.id,
        mypings: req.params.mypingsId,
      });
    })
    .then((result) => res.status(200).json({ message: 'success' }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 마이핑스 공유 취소하기 */
router.delete('/:mypingsId/sharepings', (req, res) => {
  SharePings.destroy({
    where: {
      guest: req.user.id,
      mypings: req.params.mypingsId,
    },
  })
    .then((result) => {
      if (result) res.status(200).json({ message: 'success' });
      else throw new Error('마이핑스가 존재하지 않습니다.');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 마이핑스 생성 - Unmanaged Transaction */
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    /* MYPINGS 테이블에 INSERT */
    const newMypings = await MyPings.create(
      {
        title: req.body.title,
        category: req.body.category,
        is_private: req.body.is_private,
        user: req.user?.id,
      },
      { transaction },
    );
    if (!newMypings) throw new Error('Insert Mypings Error');
    // await newMypings.save({ transaction });

    /* MYPINGS_POST 테이블에 INSERT */
    if (Array.isArray(req.body.posts) && req.body.posts.length !== 0) {
      const mypingsPostData = req.body.posts.map((postId) => {
        return { mypings: newMypings.id, post: postId };
      });
      await MyPingsPost.bulkCreate(mypingsPostData, { transaction, returning: true });
      // await newMypingsPost.save({ transaction });
    }

    await transaction.commit();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'fail' });
  }
});

/* 마이핑스 수정 - Managed Transaction */
router.patch('/:mypingsId', isAccessible, async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      /* MYPINGS UPDATE */
      const updateMypingsResult = await MyPings.update(
        {
          // 값 변경 없어도 updated_at 갱신됨 갱신된 행 수 반환
          title: req.body.title,
          category: req.body.category,
          is_private: req.body.is_private,
        },
        { where: { user: req.user?.id, id: req.params.mypingsId } },
        { transaction },
      );
      if (updateMypingsResult[0] === 0) throw new Error('Update Mypings Error');

      /* MYPINGS_POST 테이블에 DELETE */
      if (Array.isArray(req.body.delPosts) && req.body.delPosts.length !== 0) {
        const deleteMypingsPostResult = await MyPingsPost.destroy(
          {
            where: {
              mypings: req.params.mypingsId,
              post: {
                [Op.in]: req.body.delPosts,
              },
            },
          },
          { transaction },
        );
        if (deleteMypingsPostResult[0] === 0) throw new Error('Delete MypingsPost Error');
      }

      /* MYPINGS_POST 테이블에 INSERT */
      if (Array.isArray(req.body.selPosts) && req.body.selPosts.length !== 0) {
        const mypingsPostData = req.body.selPosts.map((postId) => {
          return { mypings: req.body.mypingsId, post: postId };
        });
        await MyPingsPost.bulkCreate(mypingsPostData, { transaction });
      }
    });
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'fail' });
  }
});

/* 특정 마이핑스에 속한 포스트 목록 가져오기 */
/**
 * SELECT p.id, p.created_at, p.title, p.hits, p.is_private, m.src
 * FROM POST p INNER JOIN MYPINGSPOST mp ON (mp.post = p.id) LEFT OUTER JOIN MEDIA m ON (m.post = p.id)
 * WHERE mp.mypings=:mypingsId
 */
router.get('/:mypingsId/posts', (req, res) => {
  MyPingsPost.findAll({ where: { mypings: req.params.mypingsId }, attributes: ['post'] })
    .then((postArray) => postArray.map((postObj) => postObj.post))
    .then((postIdArray) =>
      Post.findAll({
        include: [
          {
            model: User,
            as: 'Likers',
            attributes: ['id', 'nickname', 'profile_image_url'],
          },
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
        where: {
          id: { [Op.in]: postIdArray },
          [Op.or]: [{ user: req.user.id }, { is_private: 0 }],
        },
        attributes: [
          'id',
          'created_at',
          'updated_at',
          'title',
          'content',
          'latitude',
          'longitude',
          'hits',
          'is_private',
        ],
        order: [['created_at', 'DESC']],
      }),
    )
    .then((posts) => {
      posts ? res.status(200).json(posts) : res.status(404).json({ message: '게시물이 없습니다.' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 포스트 편집용 마이핑스 목록 가져오기 */
router.get('/posts/:postId', isAccessible, async (req, res) => {
  try {
    /* 포스트가 포함된 마이핑스 */
    const mypingsIncludePost = await MyPingsPost.findAll({
      where: {
        post: req.params.postId,
      },
      attributes: ['mypings'],
    });
    const mypingsIdIncludePost = mypingsIncludePost.map((mypingsObj) => mypingsObj.mypings);
    const mypingsIncludePostArray = await MyPings.findAll({
      where: {
        id: {
          [Op.in]: mypingsIdIncludePost,
        },
      },
      attributes: ['id', 'title', 'category', 'user', 'is_private'],
    });

    /* 포스트가 포함되지 않은 마이핑스 */
    const mypingsNotIncludePostArray = await MyPings.findAll({
      where: {
        user: req.user?.id,
        id: {
          [Op.notIn]: mypingsIdIncludePost,
        },
      },
      attributes: ['id', 'title', 'category', 'user', 'is_private'],
    });

    /* 합쳐 */
    const returnMypingsIncludePost = mypingsIncludePostArray.map((mypings) => {
      mypings.dataValues.checked = 1;
      return mypings;
    });
    const returnMypingsNotIncludePost = mypingsNotIncludePostArray.map((mypings) => {
      mypings.dataValues.checked = 0;
      return mypings;
    });

    res.status(200).json([...returnMypingsIncludePost, ...returnMypingsNotIncludePost]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'fail' });
  }
});

/* 포스트 편집용 마이핑스 선택하기 - Unmanaged Transaction */
router.post('/mypingspost/posts/:postId', isAccessible, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    /* MYPINGSPOST 테이블에 INSERT */
    if (Array.isArray(req.body.selMypings) && req.body.selMypings.length !== 0) {
      const insertData = req.body.selMypings.map((selectedId) => {
        return { mypings: selectedId, post: req.params.postId };
      });
      await MyPingsPost.bulkCreate(insertData, { transaction });
    }

    /* MYPINGSPOST 테이블에서 DELETE */
    if (Array.isArray(req.body.delMypings) && req.body.delMypings.length !== 0) {
      const deleteResult = await MyPingsPost.destroy({
        where: {
          mypings: {
            [Op.in]: req.body.delMypings,
          },
          post: req.params.postId,
        },
        transaction,
      });
      if (!deleteResult) throw new Error('Delete MyPingsPost Error');
    }

    await transaction.commit();
    res.status(200).json({ message: 'success' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'fail' });
  }
});

/* 마이핑스 삭제 - Managed Transaction */
router.delete('/:mypingsId', isAccessible, async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      /* MYPINGS_POST 테이블 DELETE */
      await MyPingsPost.destroy({
        where: {
          mypings: req.params.mypingsId,
          user: req.user?.id,
        },
        transaction,
      });

      /* SHAREPINGS 테이블 DELETE */
      await SharePings.destroy({
        where: {
          mypings: req.params.mypingsId,
          user: req.user?.id,
        },
        transaction,
      });

      /* MYPINGS 테이블 DELETE */
      const mypingsDeleteResult = await MyPings.destroy({
        // delete된 행 수 반환(배열 형태 아님)
        where: {
          id: req.params.mypingsId,
          user: req.user?.id,
        },
        transaction,
      });
      if (mypingsDeleteResult === 0) throw new Error('Delete Mypings Error');
    });
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'fail' });
  }
});

/* 마이핑스 공개 여부 설정 */
router.patch('/:mypingsId/isprivate', isAccessible, (req, res) => {
  MyPings.update(
    {
      is_private: req.body.is_private,
    },
    { where: { id: req.params.mypingsId, user: req.user?.id } },
  )
    .then((result) => {
      // 성공 시 update된 행 수 반환
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ messgae: 'fail' });
    });
});

/* 마이핑스 수정 모달용 포스트 목록 가져오기 */
router.get('/:mypingsId/modify/posts', async (req, res) => {
  try {
    /* 해당 마이핑스에 속한 포스트 */
    const includedPosts = await MyPingsPost.findAll({
      where: { mypings: req.params.mypingsId },
      attributes: ['post'],
    });
    const includedPostIdArray = includedPosts.map((postObj) => postObj.post);
    const includedPostArray = await Post.findAll({
      where: {
        user: req.user?.id,
        id: {
          [Op.in]: includedPostIdArray,
        },
      },
      attributes: ['id', 'created_at', 'title'],
    });

    /* 해당 마이핑스에 속하지 않은 포스트 */
    const notIncludedPostArray = await Post.findAll({
      where: {
        user: req.user?.id,
        id: {
          [Op.notIn]: includedPostIdArray,
        },
      },
      attributes: ['id', 'created_at', 'title'],
    });

    console.log(includedPostArray);

    /* 합쳐 */
    const returnIncludedPostArray = includedPostArray.map((includedPost) => {
      includedPost.dataValues.checked = 1;
      return includedPost;
    });
    const returnNotIncludedPostArray = notIncludedPostArray.map((notIncludedPost) => {
      notIncludedPost.dataValues.checked = 0;
      return notIncludedPost;
    });
    res.status(200).json([...returnIncludedPostArray, ...returnNotIncludedPostArray]);
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(500).json({ message: 'fail' });
  }
});

export default router;
