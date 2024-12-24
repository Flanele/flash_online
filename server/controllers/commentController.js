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
            let { page, limit } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;
    
            const comments = await Comment.findAndCountAll({
                where: { gameId },
                include: [
                    {
                        model: User,
                        attributes: ['username', 'avatar_url']  
                    }
                ],
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });
    
            if (!comments.rows.length) {
                return res.status(404).json({ message: 'Комментариев не найдено' });
            }
    
            return res.status(200).json({
                comments: comments.rows,
                totalComments: comments.count,
                totalPages: Math.ceil(comments.count / limit),
                currentPage: page
            });
    
        } catch (error) {
            console.error(error);
            return next(ApiError.badRequest('Не удалось получить комментарии'));
        }
    };
    
};

module.exports = new CommentController();