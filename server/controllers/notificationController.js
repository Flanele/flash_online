const { userSockets } = require("../consts/socket");
const ApiError = require("../error/ApiError");
const { User, Notification } = require("../models/models");

class NotoficationController {
    setSocket(ioInstance) {
        this.io = ioInstance;
    };

    async createNotification(receiverId, content, type) {
        try {
            const receiver = await User.findByPk(receiverId);
            if (!receiver) {
                throw new Error('Пользователь не найден');
            }

            const notification = await Notification.create({
                content: content,
                type: type,
                seen: false, 
                userId: receiverId,
            });

            const socketId = userSockets[receiverId]; 
            if (socketId) {
                this.io.to(socketId).emit('new_notification', {
                    content: content,
                    notificationId: notification.id
                });
                console.log('Уведомление отправлено через сокет');
            } else {
                console.log(`Пользователь с ID ${receiverId} не подключен`);
            }
        } catch (error) {
            console.log('Ошибка при создании уведомления:', error);
        }
    }

    async getAllNotifications(req, res, next) {
        try {
            const userId = req.user.id;

            const notifications = await Notification.findAll({where: {userId}});

            return res.status(200).json(notifications);

        } catch (error) {
            console.log(error);
            return next(ApiError.badRequest('Ошибка при получении всех уведомлений'));
        }
    }

    async markAsSeen(req, res, next) {
        try {

            const userId = req.user.id;
            const { id } = req.params;

            const notification = await Notification.findOne({where: {id, userId}})

            if (!notification) {
                return next(ApiError.badRequest('Запись не найдена'));
            }

            notification.seen = true;
            await notification.save();

            return res.status(200).json(notification);

        } catch (error) {
            console.log(error);
            return next(ApiError.badRequest('Ошибка при обновлении статуса уведомления'));
        }
    }
};

module.exports = new NotoficationController();