import express, { json } from 'express';
import {} from 'express-async-errors';

const resultsRouter = express.Router();

resultsRouter.get('/results', (req, res, next) => {
  const { search_query, filter } = req.query;

  res.status(200).json({ search_query, filter });
});

export default resultsRouter;

// search filter
// (title) => post, mypings;
// (content) => post;
// (user) => user;
// (category) => mypings;
// (hashtag) => post;
