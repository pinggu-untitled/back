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

const postsRouter = express.Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/bounds', postsController.getByBounds);
postsRouter.post('/', upload.none(), createPostValidator, postsController.createPost);

postsRouter.post('/images', upload.array('images'), postsController.createMedia);
postsRouter.get('/:postId', isPrivate, postIsExist, postsController.getPost);
postsRouter.patch('/:postId', postIsExist, updatePostValidator, postsController.updatePost);
// postsRouter.patch('/:postId', isAccessible, postIsExist, updatePostValidator, postsController.updatePost);
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
