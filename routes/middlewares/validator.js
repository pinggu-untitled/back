import { body, validationResult } from 'express-validator';
import logger from '../../config/logger.js';
import { db } from '../../config/mysql.js';
import { commentRepository, postRepository } from '../data/index.js';

const LAT_PATTERN = new RegExp('^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$');
const LON_PATTERN = new RegExp(
  '^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$',
);

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
};

export const createPostValidator = [
  body('title').trim().isLength({ min: 1 }).withMessage('한 글자 이상 입력해주세요!'),
  body('content').trim(),
  body('longitude')
    .custom((value) => LON_PATTERN.test(value))
    .withMessage('올바른 형식이 아닙니다!'),
  body('latitude')
    .custom((value) => LAT_PATTERN.test(value))
    .withMessage('올바른 형식이 아닙니다!'),
  validate,
];

export const updatePostValidator = [
  body('title').trim().isLength({ min: 1 }).withMessage('한 글자 이상 입력해주세요!'),
  body('content').trim(),
  body('longitude')
    .custom((value) => LON_PATTERN.test(value))
    .withMessage('올바른 형식이 아닙니다!'),
  body('latitude')
    .custom((value) => LAT_PATTERN.test(value))
    .withMessage('올바른 형식이 아닙니다!'),
  validate,
];

export const commentValidator = [
  body('content').trim().isLength({ min: 1 }).withMessage('내용을 입력해주세요!'),
  validate,
];

export async function postIsExist(req, res, next) {
  const { postId } = req.params;
  const conn = await db.getConnection();
  // FIXME 조회수 2배 이벤트 수정
  const post = await postRepository.getById(conn, postId);
  if (post === undefined) {
    logger.error(`Not Found id: ${postId} Post`);
    return res.status(404).json({ success: 'fail', message: '포스트가 존재하지 않습니다.' });
  }
  conn.release();
  next();
}

export async function commentIsExist(req, res, next) {
  const { commentId } = req.params;
  const conn = await db.getConnection();
  const comment = await commentRepository.getComment(conn, commentId);

  if (comment === undefined) {
    logger.error(`Not Found id: ${commentId} comment`);
    return res.status(404).json({ success: 'fail', message: '댓글이 존재하지 않습니다.' });
  }
  conn.release();
  next();
}
