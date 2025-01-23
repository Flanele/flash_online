const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const PORT = process.env.PORT || 9000;
const cors = require('cors');
const sequelize = require('./db');
const router = require('./routes/index');
const fileUpload = require('express-fileupload');
const path = require('path');
const { userSockets } = require('./consts/socket');
const NotificationService = require('./services/NotificationService');
const MessageService = require('./services/MessageService');

const app = express();

const allowOrigin = "http://localhost:5173";
app.use(cors({
    origin: allowOrigin, 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
}));

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({
    createParentPath: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowOrigin, 
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, 
    },
});

const notificationService = new NotificationService(io, userSockets);
const messageService = new MessageService(io, userSockets);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('send_message', (data) => {
        console.log('Message received:', data);
        socket.broadcast.emit('receive_message', data);
    });

    socket.on('login', (userId) => {
        userSockets[userId] = socket.id; 
        console.log(`Socket для userId ${userId} зарегистрирован с ID ${socket.id}`);
        console.log('Зарегистрированные сокеты:', userSockets );

        notificationService.sendNotification(userId);
        messageService.sendMessageToUser(userId);
    });

    socket.on('new_friend', (data) => {
        console.log(`New friend request sent to user with ID: ${data.friendId}`);
        const { friendId } = data;

        notificationService.sendFriendRequestNotification(friendId);
    });

    socket.on('new_message', (data) => {
        const { userId } = data;

        messageService.sendMessageToUser(userId);
    });

    socket.on('read_message', ({ userId, receiverId }) => {

        if (userSockets[userId]) {
            io.to(userSockets[userId]).emit('read_message', {userId, receiverId});
        }
    });

    socket.on('disconnect', () => {
        for (let userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                console.log(`Socket for userId ${userId} has disconnected`);
                break;
            }
        }
    });
});

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB is ready');
        console.log('DB name:', sequelize.getDatabaseName());

        await sequelize.sync();
        server.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();


