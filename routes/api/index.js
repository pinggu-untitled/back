import { Router } from 'express';
import auth from './auth.js';
import user from './user.js';
import follow from './follow.js';
import mypings from './mypings.js';
import posts from './posts.js';
import results from './results.js';
import searchHistories from './searchHistories.js';
import profile from './profile.js';
import { isLoggedIn } from '../middlewares/login.js';

const router = Router();

router.use('/auth', auth);
router.use('/profile', isLoggedIn, profile);
router.use('/users', user);
router.use('/follow', isLoggedIn, follow);
router.use('/mypings', isLoggedIn, mypings);
// router.use('/results', isLoggedIn, results);
router.use('/posts', isLoggedIn, posts);
router.use('/posts', posts);
router.use('/search_histories', isLoggedIn, searchHistories);

export default router;
