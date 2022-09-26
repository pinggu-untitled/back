import { body, validationResult } from 'express-validator';

const LAT_PATTERN = new RegExp(
  '^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$'
);
const LON_PATTERN = new RegExp(
  '^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$'
);

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array() });
};

export const createPostValidator = [
  body('post.title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('한 글자 이상 입력해주세요!'),
  body('post.content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('한 글자 이상 입력해주세요!'),
  body('post.longitude')
    .custom((value) => LON_PATTERN.test(value))
    .withMessage('올바른 형식이 아닙니다!'),
  body('post.latitude')
    .custom((value) => LAT_PATTERN.test(value))
    .withMessage('올바른 형식이 아닙니다!'),
  body('mentions')
    .custom((value) => value.every((el) => el.user !== ''))
    .withMessage('대상을 입력해주세요!'),
  body('hashtags')
    .custom((value) => value.every((el) => el.content !== ''))
    .withMessage('해쉬태그 내용을 입력해주세요!'),
  validate,
];

export const updatePostValidator = [
  body('post.title').trim().isLength({ min: 1 }),
  body('post.content').trim().isLength({ min: 1 }),
  body('post.longitude').custom((value) => LON_PATTERN.test(value)),
  body('post.latitude').custom((value) => LAT_PATTERN.test(value)),
  body('mentions')
    .custom((value) => value.every((el) => el.user !== ''))
    .withMessage('대상을 입력해주세요!'),
  body('hashtags')
    .custom((value) => value.every((el) => el.content !== ''))
    .withMessage('해쉬태그 내용을 입력해주세요!'),
  validate,
];

export const createCommentValidator = [
  body('comment').trim().isEmpty().withMessage('내용을 입력해주세요!'),
  validate,
];

export const updateCommentValidator = [
  body('comment').trim().isEmpty().withMessage('내용을 입력해주세요!'),
  validate,
];
