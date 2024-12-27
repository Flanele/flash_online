const Router = require('express').Router(); 
const userRouter = require('./userRouter'); 
const gameRouter = require('./gameRouter');
const genreRouter = require('./genreRouter');
const favoriteRouter = require('./favoriteRouter');
const commentRouter = require('./commentRouter');
const notificationRouter = require('./notificationRouter');

Router.use('/user', userRouter); 
Router.use('/game', gameRouter);
Router.use('/genre', genreRouter);
Router.use('/favorite', favoriteRouter);
Router.use('/comment', commentRouter);
Router.use('/notification', notificationRouter);


module.exports = Router; 