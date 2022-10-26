import express, { json } from 'express';
import {} from 'express-async-errors';
import {
  commentValidator,
  createPostValidator,
  updatePostValidator,
  postIsExist,
  commentIsExist,
} from '../middlewares/validator.js';
import { postsController, commentController, likedController } from '../controller/index.js';
import { upload } from '../middlewares/upload.js';
import { isAccessible } from './../middlewares/accessible.js';
import { isPrivate } from './../middlewares/private.js';
import { db } from '../../config/mysql.js';

const postsRouter = express.Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/all', postsController.getAllTest);
// TODO 지도 범위 내에 등록된 포스트 조회
postsRouter.get('/bounds', async (req, res, next) => {
  const { swLat, swLng, neLat, neLng, tab } = req.query;
  const conn = await db.getConnection();
  // const userId = req.user.id;
  const userId = req.user.id;
  try {
    let result;
    switch (tab) {
      case 'home':
        result = await conn
          .execute(
            'SELECT po.id, po.title, po.content, po.longitude, po.latitude, po.hits, po.is_private, po.created_at, po.updated_at, us.id as userId, us.nickname, us.profile_image_url FROM POST as po join USER as us on po.user = us.id where ((po.user in (SELECT distinct fo.follow from FOLLOW as fo where fo.host = ?) and po.is_private = 0) or po.user = ?) and ((po.latitude between ? and ?) and (po.longitude between ? and ?)) ORDER BY po.created_at desc',
            [Number(userId), Number(userId), swLat, neLat, swLng, neLng],
          )
          .then((result) => result[0]);
        return res.status(200).json(result);
      case 'explore':
        return res.status(200).json(result);
      default:
        return res.status(403).json({ message: 'invalid tab' });
    }
  } catch (err) {
    console.error(err);
    conn.release();
    return res.status(500).json(err);
  }
});
postsRouter.post('/', upload.none(), createPostValidator, postsController.createPost);

postsRouter.post('/images', upload.array('images'), postsController.createMedia);
postsRouter.get('/:postId', isPrivate, postIsExist, postsController.getPost);
postsRouter.patch('/:postId', isAccessible, postIsExist, updatePostValidator, postsController.updatePost);
postsRouter.delete('/:postId', isAccessible, postIsExist, postsController.removePost);

postsRouter.get('/:postId/comments', postIsExist, commentController.getComment);
postsRouter.post('/:postId/comments', postIsExist, commentValidator, commentController.createComment);
postsRouter.patch(
  '/:postId/comments/:commentId',
  isAccessible,
  postIsExist,
  commentIsExist,
  commentValidator,
  commentController.updateComment,
);
postsRouter.delete(
  '/:postId/comments/:commentId',
  isAccessible,
  postIsExist,
  commentIsExist,
  commentController.removeComment,
);

postsRouter.get('/:postId/liked', isPrivate, postIsExist, likedController.getLiked);
postsRouter.post('/:postId/liked', postIsExist, likedController.createLiked);
postsRouter.delete('/:postId/liked', postIsExist, likedController.removeLiked);

export default postsRouter;
