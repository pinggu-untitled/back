import express, { json } from 'express';
import {} from 'express-async-errors';
import {
  createCommentValidator,
  createPostValidator,
  updateCommentValidator,
  updatePostValidator,
} from '../middlewares/validator.js';
import { postsController, commentController, likedController } from '../controller/index.js';
import { upload } from '../middlewares/upload.js';

const postsRouter = express.Router();

postsRouter.get('/', postsController.getPosts);

postsRouter.post('/', upload.none(), createPostValidator, postsController.createPost);

postsRouter.post('/images', upload.array('images'), postsController.createMedia);
postsRouter.get('/:postId', postsController.getPost);
postsRouter.patch('/:postId', updatePostValidator, postsController.updatePost);
postsRouter.delete('/:postId', postsController.removePost);

postsRouter.get('/:postId/comments', commentController.getComment);
postsRouter.post('/:postId/comments', createCommentValidator, commentController.createComment);
postsRouter.patch('/:postId/comments/:commentId', updateCommentValidator, commentController.updateComment);
postsRouter.delete('/:postId/comments/:commentId', commentController.removeComment);

postsRouter.get('/:postId/liked', likedController.getLiked);
postsRouter.post('/:postId/liked', likedController.createLiked);
postsRouter.delete('/:postId/liked', likedController.removeLiked);

export default postsRouter;
