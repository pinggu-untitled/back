import multer from "multer";
import path from "node:path";
import { v4 as uuid } from "uuid";
import mime from "mime-types";

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).send("로그인 사용자만 접근 가능");
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(401).send("로그인하지 않은 사용자만 접근 가능");
  } else {
    next();
  }
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      // const ext = path.extname(file.originalname);
      // cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});
