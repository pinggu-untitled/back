import { Router } from 'express';
import auth from './auth.js';
import user from './user.js';
import follow from './follow.js';
import mypings from './mypings.js';
import posts from './posts.js';
import results from './results.js';
import searchHistories from './searchHistories.js';
import followingPosts from './followingPosts.js';
import profile from './profile.js';
import {} from 'express-async-errors';

const router = Router();

router.use('/auth', auth);
router.use('/profile', profile);
router.use('/users', user);
router.use('/follow', follow);
router.use('/mypings', mypings);
router.use('/posts', posts);
router.use('/results', results);
router.use('/search_histories', searchHistories);
router.use('/following', followingPosts);

export default router;
