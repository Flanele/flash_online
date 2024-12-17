const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const ApiError = require('../error/ApiError');


const generateJwt = (id, email, role) => {
    return jwt.sign({id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
};

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, role, username } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }
            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, role, password: hashPassword, username, avatar_url: null });
            const token = generateJwt(user.id, user.email, user.role);
            return res.status(201).json({ 
                token,
                email: user.email,
                role: user.role,
                username: user.username,
                avatar_url: user.avatar_url
             });
        } catch (error) {
            console.error(error); 
            return next(ApiError.internal('Ошибка при регистрации')); 
        }
    };

    async login (req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}});

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }

            let comparedPassword = bcrypt.compareSync(password, user.password);
            if (!comparedPassword) {
                return next(ApiError.internal('Неверный пароль пользователя'));
            }

            const token = generateJwt(user.id, user.email, user.role);
            return res.status(200).json({
                token,
                email: user.email,
                role: user.role,
                username: user.username,
                avatar_url: user.avatar_url
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Ошибка при авторизации'));
        }
        
    };

    async check(req, res, next) {
        try {
            const { email } = req.user;
            const user = await User.findOne({ where: { email } });
    
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
    
            const token = generateJwt(user.id, user.email, user.role);
    
            return res.status(200).json({
                token,
                email: user.email,
                role: user.role,
                username: user.username,
                avatar_url: user.avatar_url,
            });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Что-то пошло не так во время проверки аутентификации.'));
        }
    }
    
};

module.exports = new UserController();