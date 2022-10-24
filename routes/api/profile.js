import express from 'express';
import { profileController } from '../controller/index.js';
import { profileUpload } from '../middlewares/upload.js';

const profileRouter = express.Router();

profileRouter.post('/image', profileUpload.single('image'), profileController.updateProfileImage);
profileRouter.patch('/info', profileController.updateProfileInfo);

export default profileRouter;
