const ApiError = require("../error/ApiError");
const { Game, Comment, User } = require("../models/models");

class CommentController {
    async addNewComment (req, res, next) {
        try {
            const userId = req.user.id;
            const { id: gameId } = req.params;
            const { text } = req.body;

            const game = await Game.findOne({ where: { id: gameId } });
            if (!game) {
                return next(ApiError.badRequest('Игра не найдена'));
            }

            if (!text || text.trim().length === 0) {
                return next(ApiError.badRequest('Комментарий не может быть пустым'));
            }

            const comment = await Comment.create({
                text,
                userId,
                gameId
            })

            return res.status(200).json(comment);
        } catch (error) {
            console.log(error);
            return next(ApiError.badRequest('Не удалось добавить комментарий'));
        }
    
    };

    async getAllComments(req, res, next) {
        try {
            const { id: gameId } = req.params;
    
            const comments = await Comment.findAll({
                where: { gameId },
                include: [
                    {
                        model: User,
                        attributes: ['username', 'avatar_url']  
                    }
                ]
            });
    
            if (!comments.length) {
                return res.status(404).json({ message: 'Комментариев не найдено' });
            }
    
            return res.status(200).json(comments);
    
        } catch (error) {
            console.error(error);
            return next(ApiError.badRequest('Не удалось получить комментарии'));
        }
    };
    
};

module.exports = new CommentController();