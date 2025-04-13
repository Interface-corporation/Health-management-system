// routes/userRoutes.js
import express from 'express';

const Router = express.Router();

Router.get('/', (req, res) => {
  res.send('<h1>This is user routes</h1>');
});

Router.get('/1', (req, res) => {
  res.send('<h1>This is user 1 route</h1>');
});

Router.get('/2', (req, res) => {
  res.send('<h1>This is user 2 route</h1>');
});

export default Router;
