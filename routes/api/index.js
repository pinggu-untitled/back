import { Router } from 'express';
import users from './users.js';
import posts from './posts.js';
import chatrooms from './chatrooms.js';
import notifications from './notifications.js';
import searchHistories from './searchHistories.js';
import results from './results.js';

const router = Router();

router.use('/users', users);
router.use('/posts', posts);
router.use('/search_histories', searchHistories);
router.use('/results', results);
router.use('/chatrooms', chatrooms);

export default router;
