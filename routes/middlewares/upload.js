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

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, `uploads/images/${time.year}/${time.month}/${time.date}/`);
  },
  filename: (req, file, done) => {
    done(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const profileStorage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, `uploads/images/profile/`);
  },
  filename: (req, file, done) => {
    done(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const upload = multer({ storage });
export const profileUpload = multer({storage : profileStorage});
