import { Router } from 'express';
import auth from './auth.js';
import user from './user.js';
import follow from './follow.js';
import mypings from './mypings.js';
import postsRouter from './posts.js';

const router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/follow', follow);
router.use('/mypings', mypings);
router.use('/posts', postsRouter);

export default router;