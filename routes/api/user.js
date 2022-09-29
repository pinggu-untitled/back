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

export default router;