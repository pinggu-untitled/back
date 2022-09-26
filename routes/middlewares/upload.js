import multer from "multer";
import { v4 as uuid } from "uuid";
import mime from "mime-types";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
