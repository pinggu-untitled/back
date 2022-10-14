import morgan from 'morgan';
import logger from '../../config/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const morganMiddleware = morgan(
  'HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms',
  { stream: logger.stream },
);

export default morganMiddleware;
