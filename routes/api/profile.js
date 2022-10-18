// import express, { json } from 'express';
// import {} from 'express-async-errors';
import { profileController } from '../controller/index.js';
// import { upload } from '../middlewares/upload.js';
const profileRouter = express.Router();

profileRouter.post('/image', profileController.updateProfileImage);
profileRouter.patch('/info', profileController.updateProfileInfo);