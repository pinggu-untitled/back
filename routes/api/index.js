import { Router } from 'express';
import auth from './auth.js';
import user from './user.js';
import follow from './follow.js';
import mypings from './mypings.js';
import posts from './posts.js';
import results from './results.js';
import searchHistories from './searchHistories.js';
import profile from './profile.js';
import {} from 'express-async-errors';
import { isLoggedIn } from '../middlewares/login.js';

const router = Router();

router.use('/auth', auth);
router.use('/profile', isLoggedIn, profile);
router.use('/users', isLoggedIn, user);
router.use('/follow', isLoggedIn, follow);
router.use('/mypings', isLoggedIn, mypings);
router.use('/posts', isLoggedIn, posts);
router.use('/results', isLoggedIn, results);
router.use('/search_histories', isLoggedIn, searchHistories);

export default router;
