import { Router } from 'express';
import auth from './auth.js';
import user from './user.js';
import mypings from './mypingsjs';

const router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/mypings', mypings);

export default router;