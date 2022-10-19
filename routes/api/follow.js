import express from 'express';
import db from '../../models/index.js';
const { Follow } = db;

const router = express.Router();

/* 팔로우하기 */
router.post('/:userId', (req, res) => {
  Follow.create({ host: req.user?.id, follow: req.params.userId })
    .then((result) => {
      // 성공 시 insert 된 로우 반환
      if (result) res.status(200).json({ message: 'success' });
      else throw new Error('I0');
    })
    .catch((err) => {
      err.message === 'I0' ? res.status(404).json({ message: 'fail' }) : res.status(500).json({ message: 'fail' });
    });
});

/* 언팔로우하기 */
router.delete('/:userId', (req, res) => {
  Follow.destroy({ where: { host: req.user.id, follow: req.params.userId } })
    .then((result) => {
      // 성공 시 delete 된 로우 수 반환
      if (result !== 0) res.status(200).json({ message: 'success' });
      else throw new Error('D0');
    })
    .catch((err) => {
      err.message === 'D0'
        ? res.status(404).json({ message: '이미 언팔로우된 상태입니다.' })
        : res.status(500).json({ message: 'fail' });
    });
});

export default router;
