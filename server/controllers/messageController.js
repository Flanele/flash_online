const ApiError = require("../error/ApiError");
const { Message } = require("../models/models");
const { Op } = require('sequelize');
const { encryptText, decryptText } = require('../utils/encription');

class MessageController {
    async getAllMessagesWithUser(req, res, next) {
        try {
            const userId = req.user.id;
            const { receiverId } = req.params;
            const { page = 1, limit = 20 } = req.query;  
    
            const offset = (page - 1) * limit;  
    
            const whereConditions = {
                [Op.or]: [
                    { senderId: userId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: userId }
                ]
            };
    
            const messages = await Message.findAll({
                where: whereConditions,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit, 10),   
                offset: parseInt(offset, 10),  
            });
    
            const decryptedMessages = messages.map(message => ({
                ...message.toJSON(),
                text: decryptText(message.text), 
            }));
    
            return res.status(200).json(decryptedMessages);
        } catch (error) {
            console.log(error);
            return next(ApiError.badRequest('Не получилось загрузить историю переписки с пользователем'));
        }
    }

    async getMessages(req, res, next) {
        try {

            const userId = req.user.id;

            const messages = await Message.findAll({where: {receiverId: userId}});

            const decryptedMessages = messages.map(message => ({
                ...message.toJSON(),
                text: decryptText(message.text)
            }));

            return res.status(200).json(decryptedMessages);

        } catch(error) {
            console.log(error);
            return next(ApiError.badRequest('Ошибка при получении всех сообщений'));
        }
    }

    async markMessageAsRead(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const message = await Message.findOne({ where: { id, receiverId: userId } });

            if (!message) {
                return next(ApiError.badRequest('Сообщение не найдено'));
            }

            message.read = true;
            await message.save();

            return res.status(200).json(message);
        } catch (error) {
            return next(ApiError.badRequest('Не удалось изменить статус сообщения'));
        }
    }

    async getUnreadMessagesByUser(req, res, next) {
        try {

            const userId = req.user.id;
            const { senderId } = req.params;

            const unreadMessagesCount = await Message.count({where: {senderId: senderId, receiverId: userId, read: false}});

            return res.status(200).json(unreadMessagesCount);


        } catch(error) {
            console.log(error);
            return next(ApiError.badRequest('Ошибка при получении непрочитанных сообщений'));
        }
    }

    async createMessage(req, res, next) {
        try {
            const userId = req.user.id;
            const { receiverId } = req.params;
            const { text } = req.body;

            const encryptedText = encryptText(text);

            const message = await Message.create({
                senderId: userId,
                receiverId: receiverId,
                text: encryptedText,
                read: false,
                edited: false
            });

            return res.status(200).json({
                ...message.toJSON(),
                text: decryptText(encryptedText)
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Ошибка создания сообщения'));
        }
    }

    async deleteMessage(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const message = await Message.findOne({ where: { id, senderId: userId } });

            if (!message) {
                return next(ApiError.badRequest('Сообщение не найдено'));
            }

            await message.destroy();

            return res.status(200).json('Сообщение успешно удалено');
        } catch (error) {
            console.log(error);
            return next(ApiError.badRequest('Ошибка при удалении сообщения'));
        }
    }

    async editMessage(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { text } = req.body;
    
            if (!text || text.trim() === '') {
                return next(ApiError.badRequest('Текст сообщения не может быть пустым'));
            }
       
            const message = await Message.findOne({ where: { id, senderId: userId } });
    
            if (!message) {
                return next(ApiError.badRequest('Сообщение не найдено или доступ запрещён'));
            }
    
            const oldText = decryptText(message.text);
            const encryptedText = encryptText(text);
            message.text = encryptedText;
            message.edited = true;
    
            await message.save();
    
            console.log(`Сообщение ${id} пользователя ${userId} обновлено: "${oldText}" -> "${text}"`);
    
            return res.status(200).json({
                ...message.toJSON(),
                text: decryptText(encryptedText)
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.badRequest('Ошибка при редактировании сообщения'));
        }
    }
    
};

module.exports = new MessageController();
