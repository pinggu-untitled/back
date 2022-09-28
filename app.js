import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import helmet from 'helmet';
import passport from 'passport';
import db from './models/index.js';
import passportConfig from './passport/index.js';
import apiRouter from './routes/api/index.js';

dotenv.config();
// const webSocket = require("./socket");

const app = express();
app.set('PORT', process.env.PORT || 8080);
db.sequelize
  .sync()
  .then(() => console.log('✅ DB 연결 성공했슴당'))
  .catch((err) => console.error(err));

passportConfig();

const prod = process.env.NODE_ENV === 'production';

if (prod) {
  app.enable('trust proxy');
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  httpOnly: true,
};

if (prod) {
  sessionOption.cookie.secure = true;
  sessionOption.cookie.proxy = true;
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', apiRouter);

app.use((err, req, res, next) => {
  return res.send(err);
});

app.get('*', (req, res, next) => {
  return res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(app.get('PORT'), () => console.log(`✅ Express 서버 구동 중 http://localhost:${app.get('PORT')}`));

// webSocket(server, app)
