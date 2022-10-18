import { Router } from 'express';
import { Op } from 'sequelize';
import db from '../../models/index.js';
const { Follow, Post, Media } = db;

const router = Router();

// router.get('/posts', async (req, res) => {
//   try {
//     /* 현재 로그인한 사용자가 팔로우하고 있는 친구의 아이디 값 가져오기 */
//     const followings = await Follow.findAll({
//       where: {
//         host: req.user.id
//       },
//       attributes: ['follow']
//     });
//     const followingIdArray = followings.map(following => following.follow);

//     /* 가져온 팔로잉 친구들의 포스트 가져오기 - join Media*/
//     const posts = await Post.findAll({
//       include: [{
//         model: Media,
//         attributes: ['src'],
//         limit: 1
//       }],
//       where: {
//         user: {
//           [Op.in]: followingIdArray
//         }
//       },
//       attributes: ['id', 'created_at', 'title', 'hits', 'is_private']
//     });
//     res.status(200).json(posts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'fail' });
//   }
// });
router.get('/posts', (req, res) => {
  Follow.findAll({ where: { host: req.user.id }, attributes: ['follow']})
    .then(followings => followings.map(following => following.follow));
});

export default router;