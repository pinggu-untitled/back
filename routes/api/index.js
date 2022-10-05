import { Router } from 'express';
import auth from './auth.js';
import user from './user.js';
import follow from './follow.js';

const router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/follow', follow);

export default router;