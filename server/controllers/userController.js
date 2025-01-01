const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Notification } = require('../models/models');
const ApiError = require('../error/ApiError');
const { v4: uuidv4 } = require('uuid');
const path = require('path'); 
const fs = require('fs');
const { Op } = require('sequelize'); 


const generateJwt = (id, email, role, username) => {
    return jwt.sign({id, email, role, username}, 
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
            const token = generateJwt(user.id, user.email, user.role, user.username);

            const content = `Welcome to the FancyGames, ${user.username}!`;
            const type = 'welcome'; 
            
            await Notification.create({
                userId: user.id,
                content,
                type,
                seen: false,
            });

            return res.status(201).json({ 
                token,
                id: user.id,
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

            const token = generateJwt(user.id, user.email, user.role, user.username);
            return res.status(200).json({
                token,
                id: user.id,
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

    async editUser(req, res, next) {
        try {
            const { username } = req.body;
            let avatar_url = req.files?.img;
            const userId = req.user.id; 
    
            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
    
            if (username) user.username = username;
    
            if (avatar_url) {
                console.log('req.files:', req.files); 
                const fileExtension = avatar_url.name.split('.').pop();
                const filename = uuidv4() + '.' + fileExtension;
    
                const staticPath = path.resolve(__dirname, '..', 'static');
                if (!fs.existsSync(staticPath)) {
                    fs.mkdirSync(staticPath);
                }
    
                avatar_url.mv(path.resolve(staticPath, filename), (err) => {
                    if (err) {
                        return next(ApiError.internal('Ошибка при загрузке изображения'));
                    }
                });
    
                user.avatar_url = `${filename}`;
            }
    
            await user.save();
    
            return res.status(200).json({
                id: user.id,
                email: user.email,
                username: user.username,
                avatar_url: user.avatar_url,
                role: user.role,
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Ошибка при редактировании'));
        }
    };

    async check(req, res, next) {
        try {
            const { email } = req.user;
            const user = await User.findOne({ where: { email } });
    
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
    
            const token = generateJwt(user.id, user.email, user.role, user.username);
    
            return res.status(200).json({
                token,
                id: user.id,
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

    async getAllUsers(req, res, next) {
        try {
            const userId = req.user?.id;
            const searchTerm = req.query.searchTerm || null;
    
            const whereCondition = {
                id: {
                    [Op.ne]: userId,
                },
            };
    
            if (searchTerm) {
                whereCondition.username = {
                    [Op.like]: `%${searchTerm}%`,
                };
            }
    
            const users = await User.findAll({
                where: whereCondition,
            });
    
            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Не получилось получить список пользователей'));
        }
    }
        
    
};

module.exports = new UserController();