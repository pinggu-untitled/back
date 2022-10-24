import db from '../../models/index.js';
const { MyPings, Post, Comment } = db;

export const isAccessible = async (req, res, next) => {
  try {
    let result;
    if (req.originalUrl.includes('comments')) {
      result = await Comment.findOne({ where: { id: req.params.commentsId }, attributes: ['user'] });
    } else if (req.originalUrl.includes('posts')) {
      result = await Post.findOne({ where: { id: req.params.postId }, attributes: ['user'] });
    } else if (req.originalUrl.includes('mypings')) {
      result = await MyPings.findOne({ where: { id: req.params.mypingsId }, attributes: ['user'] });
    }
    if (result?.user !== req.user.id) throw new Error('접근 권한이 없습니다.');
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'fail' });
  }
};
