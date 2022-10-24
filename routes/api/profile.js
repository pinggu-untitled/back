import express from 'express';
import { profileController } from '../controller/index.js';
import { upload } from '../middlewares/upload.js';
const profileRouter = express.Router();

profileRouter.post('/image', upload.single('file'), profileController.updateProfileImage);
// profileRouter.post('/image', profileController.updateProfileImage, (req, res, next) => {
//   console.log(11);
//   return res.status(201).json(req.file.name);
// })
profileRouter.patch('/info', profileController.updateProfileInfo);

export default profileRouter;

//TODO Profile 수정
