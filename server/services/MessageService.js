const { Message } = require("../models/models");
const { decryptText } = require('../utils/encription');

class MessageService {
    constructor(io, userSockets) {
        this.io = io;
        this.userSockets = userSockets;
        this.sentMessages = new Set();

        setInterval(() => {
            this.sentMessages.clear();
            console.log("Хранилище отправленных сообщений очищено");
        }, 3600000);
    }

    async sendMessageToUser(userId) {
        const socketId = this.userSockets[userId];
        if (!socketId) {
            console.log(`Пользователь ${userId} не подключен`);
            return;
        }

        const messages = await Message.findAll({
            where: { receiverId: userId, read: false },
            order: [['createdAt', 'DESC']],
        });

        messages.forEach((message) => {
            if (!this.sentMessages.has(message.id)) {
                const decryptedMessage = decryptText(message.text); 

                this.io.to(socketId).emit("new_message", {
                    id: message.id,
                    text: decryptedMessage,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    createdAt: message.createdAt,
                    read: message.read,
                });

                console.log(`Сообщение отправлено пользователю ${userId}:`, decryptedMessage);

                this.sentMessages.add(message.id);
            }
        });
    }
}

module.exports = MessageService;