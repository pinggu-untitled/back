import { Router } from 'express';
import results from './results.js';

const router = Router();

router.use('/results', results);

export default router;

// search filter
// (title) => post, mypings;
// (content) => post;
// (user) => user;
// (category) => mypings;
// (hashtag) => post;
