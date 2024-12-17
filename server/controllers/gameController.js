const ApiError = require('../error/ApiError');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { Game, Genre } = require('../models/models');
const { Op } = require('sequelize'); 

class GameController {
    async addGame(req, res, next) {
        try {

            const { title, description, file_url } = req.body;
            const genreIds = req.body.genreIds.split(',').map(Number);
            const { preview_url } = req.files;

            console.log('Received data:', { title, description, file_url, genreIds });
            console.log(req.files);

            let filename = uuidv4() + ".jpg";
            const staticPath = path.resolve(__dirname, '..', 'static');
    
            if (!fs.existsSync(staticPath)) {
                fs.mkdirSync(staticPath);
            }

            await preview_url.mv(path.resolve(staticPath, filename));

            const game = await Game.create({ title, description, file_url, preview_url: filename });

            if (genreIds && Array.isArray(genreIds)) {
                const genres = await Genre.findAll({
                    where: { id: genreIds }
                });

                if (genres.length !== genreIds.length) {
                    return next(ApiError.badRequest("Некоторые жанры не найдены"));
                }

                await game.addGenres(genres);
            }

            console.log('Created item:', game);

            return res.status(201).json(game);
    

        } catch (e) {
            console.log(e);
            next(ApiError.badRequest("Ошибка при добавлении игры"));
        }
    };

    async getAll(req, res, next) {
        try {
            const { genreId, searchTerm } = req.query || null;
    
            let where = {};
            let include = [
                {
                    model: Genre,
                    through: { attributes: [] },
                    attributes: ['id', 'name'],
                },
            ];
    
            if (genreId) {
                include[0].where = { id: parseInt(genreId, 10) };
            }
    
            if (searchTerm) {
                where.title = { [Op.iLike]: `%${searchTerm}%` };
            }
    
            const games = await Game.findAndCountAll({ where, include });
    
            return res.status(200).json(games);
        } catch (e) {
            console.log(e);
            return next(ApiError.badRequest('Что-то пошло не так при получении списка игр...'));
        }
    };  
    

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const game = await Game.findOne({ 
                where: { id },
                include: [
                    {
                        model: Genre, 
                        through: { attributes: [] }, 
                        attributes: ['id', 'name'] 
                    }
                ] 
            });
    
            if (!game) {
                return next(ApiError.badRequest('Игра не найдена.'));
            }

            return res.status(200).json(game);

        } catch (e) {
            console.log(e);
            return next(ApiError.badRequest('Ошибка при поиске игры...'));
        }
    };
};

module.exports = new GameController();


