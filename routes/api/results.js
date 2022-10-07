import express, { json } from 'express';
import {} from 'express-async-errors';
import { resultController } from '../controller/index.js';

const resultsRouter = express.Router();

resultsRouter.get('/', resultController.getResult);

export default resultsRouter;
