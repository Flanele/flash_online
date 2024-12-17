const Router = require('express').Router(); 
const userRouter = require('./userRouter'); 
const gameRouter = require('./gameRouter');
const genreRouter = require('./genreRouter');

Router.use('/user', userRouter); 
Router.use('/game', gameRouter);
Router.use('/genre', genreRouter);


module.exports = Router; 