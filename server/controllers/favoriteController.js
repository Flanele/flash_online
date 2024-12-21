const ApiError = require("../error/ApiError");
const { Game, FavoriteGame } = require("../models/models");

class FavoriteController {

    async getAllFavorites(req, res, next) {
        try {

            const userId = req.user.id;

            const favorite = await FavoriteGame.findAll({
                where: { userId: userId },
                include: [{
                    model: Game,
                    attributes: ['id', 'title', 'description', 'popularity_score', 'file_url', 'preview_url']
                }]
            });

            return res.status(200).json(favorite);

        } catch (error) {
            return next(ApiError.badRequest('Не удалось загрузить избранные пользователя'));
        }
    };

    async addGameToFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const { id: gameId } = req.params;

            const game = await Game.findOne({ where: { id: gameId } });
            if (!game) {
                return next(ApiError.badRequest('Игра не найдена'));
            }

            const existingFavoriteGame = await FavoriteGame.findOne({ where: { userId, gameId } });
            if (existingFavoriteGame) {
                return next(ApiError.badRequest('Эта игра уже добавлена в избранное'));
            }

            await FavoriteGame.create({ userId, gameId });

            await Game.update(
                { popularity_score: game.popularity_score + 1 },
                { where: { id: gameId } }
            );

            return res.status(201).json({ message: 'Игра успешно добавлена в избранное' });
        } catch (error) {
            return next(ApiError.badRequest('Что-то пошло не так при добавлении в избранное...'));
        }
    };

    async removeGameFromFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const { id: gameId } = req.params;
    
            const game = await Game.findOne({ where: { id: gameId } });
            if (!game) {
                return next(ApiError.badRequest('Игра не найдена'));
            }
    
            const existingFavoriteGame = await FavoriteGame.findOne({ where: { userId, gameId } });
            if (!existingFavoriteGame) {
                return next(ApiError.badRequest('Эта игра не добавлена в избранное'));
            }
    
            await existingFavoriteGame.destroy();
            await Game.update(
                { popularity_score: game.popularity_score - 1 },
                { where: { id: gameId } }
            );
    
            return res.status(200).json({ message: 'Игра удалена из избранного' });
        } catch (error) {
            return next(ApiError.badRequest('Что-то пошло не так при удалении из избранного...'));
        }
    };

    async checkIsGameFavorite(req, res, next) {
        try {
            const { id: gameId } = req.params;
            const userId = req.user.id; 
    
            const favoriteGame = await FavoriteGame.findOne({
                where: { userId, gameId },
            });
    
            if (favoriteGame) {
                return res.status(200).json(true); 
            }
    
            return res.status(200).json(false); 
        } catch (error) {
            return next(ApiError.badRequest('Не удалось проверить статус избранного'));
        }
    };
    
};

module.exports = new FavoriteController();