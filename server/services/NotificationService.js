const { Notification } = require("../models/models");

class NotificationService {
    constructor(io, userSockets) {
        this.io = io;
        this.userSockets = userSockets;
        this.sentNotifications = new Set(); 

        setInterval(() => {
            this.sentNotifications.clear();
            console.log("Хранилище отправленных уведомлений очищено");
        }, 3600000); 
        
    }

    async sendNotification(userId) {
        const socketId = this.userSockets[userId];
        if (!socketId) {
            console.log(`Пользователь ${userId} не подключен`);
            return;
        }

        const notifications = await Notification.findAll({
            where: { userId, seen: false },
            order: [["createdAt", "ASC"]],
        });

        notifications.forEach((notif) => {
            if (!this.sentNotifications.has(notif.id)) {
               this.io.to(socketId).emit("new_notification", {
                id: notif.id,
                content: notif.content,
                type: notif.type,
                seen: notif.seen,
                userId: notif.userId,
                from: notif.from,
                createdAt: notif.createdAt
                });

                console.log(`Уведомление отправлено пользователю ${userId}:`, notif.content);

                this.sentNotifications.add(notif.id);
            }
        
        });

    }

    async sendFriendRequestNotification(friendId) {
        const socketId = this.userSockets[friendId];
        if (!socketId) {
            console.log(`Пользователь ${friendId} не подключен`);
            return;
        }

        console.log(`Сокет ID для пользователя ${friendId}: ${socketId}`);

        const notifications = await Notification.findAll({
            where: { userId: friendId, seen: false },
            order: [["createdAt", "ASC"]],
        });

        console.log(`Найдено ${notifications.length} уведомлений для пользователя ${friendId}`);

        notifications.forEach((notif) => {
            if (!this.sentNotifications.has(notif.id)) {
                this.io.to(socketId).emit("new_notification", {
                    id: notif.id,
                    content: notif.content,
                    type: notif.type,
                    seen: notif.seen,
                    userId: notif.userId,
                    from: notif.from,
                    createdAt: notif.createdAt
                });

                console.log(`Уведомление о заявке в друзья отправлено пользователю ${friendId}:`, notif.content);

                this.sentNotifications.add(notif.id);
            }
        });
    }
}

module.exports = NotificationService;
