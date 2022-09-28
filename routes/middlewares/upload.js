import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const uuid = () => {
  const tokens = uuidv4().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();

const currentTime = new Date(year, month, day, 9);

export const time = {
  year: currentTime.getFullYear(),
  month: currentTime.getMonth() + 1,
  date: currentTime.getDate(),
};

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const upload = multer({ storage });
