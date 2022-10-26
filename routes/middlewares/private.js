import db from '../../models/index.js';
const { MyPings, Post } = db;

export const isPrivate = async (req, res, next) => {
  const attributes = ['user', 'is_private'];
  let result;
  try {
    if (req.originalUrl.includes('posts')) {
      result = await Post.findOne({
        where: { id: req.params.postId },
        attributes,
      });
    } else if (req.originalUrl.includes('mypings')) {
      result = await MyPings.findOne({
        where: { id: req.params.mypingsId },
        attributes,
      });
    }
    if (result.is_private && result.user !== req.user.id) throw new Error('비공개 컨텐츠');
    next();
  } catch (err) {
    console.error(err);
    res.status(402).json({ message: err.message });
  }
};
