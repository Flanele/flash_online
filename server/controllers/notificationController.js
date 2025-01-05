const ApiError = require("../error/ApiError");
const { User, Notification } = require("../models/models");

class NotificationController {


    async getAllNotifications(req, res, next) {
        try {
            const userId = req.user.id;

            const notifications = await Notification.findAll({where: {userId}, order: [['createdAt', 'DESC']]});

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

    async deleteNotification(req, res, next) {
        try {

            const userId = req.user.id;
            const { id } = req.params;

            const notification = await Notification.findOne({where: {id, userId}});

            if (!notification) {
                return next(ApiError.badRequest('Уведомление не найдено'));
            }

            notification.destroy();

            return res.status(200).json('Уведомление успешно удалено');

        } catch(error) {
            console.log(error);
            return next(ApiError.internal('Не получилось удалить уведомление'));
        }
    }
};

module.exports = new NotificationController();