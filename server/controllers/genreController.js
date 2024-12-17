const ApiError = require("../error/ApiError");
const { Genre } = require("../models/models");

class GenreController {
    async addGenre(req, res, next) {
        try {

            const { name } = req.body;
            const genre = await Genre.create({name});
            return res.status(201).json(genre);

        } catch (e) {
            console.log(e);
            return next(ApiError.badRequest('Не удалось добавить жанр'));
        }
    };

    async getAll (req, res, next) {
        try {
            const genres = await Genre.findAll();
            return res.status(200).json(genres);
        } catch (e) {
            console.log(e);
            return next(ApiError.badRequest('Ошибка при получении списка жанров'));
        }
    };
};

module.exports = new GenreController();