import express from 'express';
import db from '../../models/index.js';
const { Follow } = db;

const router = express.Router();

/* 팔로우하기 */
router.post('/:userId', (req, res) => {
  console.log(req.user);
  Follow.create({ host: req.user.id, follow: req.params.userId })
    .then((result) => {
      // 성공 시 insert 된 로우 반환
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'fail' });
    });
});

/* 언팔로우하기 */
router.delete('/:userId', (req, res) => {
  Follow.destroy({ where: { host: req.user.id, follow: req.params.userId } })
    .then((result) => {
      // 성공 시 delete 된 로우 수 반환
      res.status(200).json({ message: 'success' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'fail' });
    });
});

export default router;
