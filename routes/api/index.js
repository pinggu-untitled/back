import { Router } from 'express';
import auth from './auth.js';
import user from './user.js';
import follow from './follow.js';
import mypings from './mypings.js';
import posts from './posts.js';
import searchHistories from './searchHistories.js';

const router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/follow', follow);
router.use('/mypings', mypings);
router.use('/posts', posts);
router.use('/search_histories', searchHistories);

export default router;