import { Router } from 'express';
import { Op } from 'sequelize';
import db from '../../models/index.js';
const { Follow, Post, Media } = db;

const router = Router();

router.get('/posts', (req, res) => {
  /* 현재 로그인한 사용자가 팔로우하고 있는 사용자 아이디 가져오기 */
  Follow.findAll({ where: { host: req.user.id }, attributes: ['follow']})
    .then(followings => followings.map(following => following.follow))
    .then(followingIdArray => 
      /* 팔로잉중인 사용자의 포스트 가져오기 */
      Post.findAll({
        include: [{ model: Media, attributes: ['src'], limit: 1}],
        where: { user: { [Op.in]: followingIdArray } },
        attributes: ['id', 'created_at', 'title', 'hits', 'is_private']
      })
    )
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ message: 'fail' }))
});

export default router;