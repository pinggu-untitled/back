import { Router } from 'express';

import { searchHistoryController } from '../controller/index.js';

const router = Router();

router.get('/', searchHistoryController.getHistory);

router.post('/', searchHistoryController.createHistory);

router.delete('/', searchHistoryController.deleteHistoryAll);

router.delete('/:historyId', searchHistoryController.deleteHistoryById);

router.get('/popular', searchHistoryController.getPopular);

export default router;
