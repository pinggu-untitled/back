import { Router } from 'express';
import auth from './auth.js';
import profile from './profile.js';

const router = Router();

router.use('/auth', auth);
router.use('/profile', profile);

export default router;