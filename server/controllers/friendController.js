const { userSockets } = require("../consts/socket");
const ApiError = require("../error/ApiError");
const { Friend, User, Notification } = require("../models/models");

class FriendController {

    async getFriendsList(req, res, next) {
        try {
            const userId = req.user.id;

            const friends = await Friend.findAll({ where: { userId: userId } });

            return res.status(200).json(friends || []);

        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Не получилось получить список друзей пользователя'));
        }
        
    };

    async addFriend(req, res, next) {
        try {

            const userId = req.user.id;
            const username = req.user.username;
            const { friendId } = req.params;

            const friend = await User.findByPk(friendId);
            if (!friend) {
                return next(ApiError.badRequest('Пользователь с таким ID не найден'));
            }

            if (userId === parseInt(friendId, 10)) {
                return next(ApiError.badRequest('Вы не можете добавить себя в друзья'));
            }            
    
            const existingFriendship = await Friend.findOne({ 
                where: { userId, friendId } 
            });
    
            if (existingFriendship) {
                return next(ApiError.badRequest('Вы уже отправили запрос этому пользователю'));
            }
    
            const friendRequest = await Friend.create({ userId, friendId, status: 'pending' });
   
            const content = `User ${username} wants to be your friend. Would you like to accept friend request?`;
            const type = 'friend request';
    
            await Notification.create({
                userId: friendId,
                content,
                type,
                seen: false,
            });

            console.log(`Запрос в друзья отправлен от ${userId} к ${friendId}`);
    
            return res.status(200).json(friendRequest);

        } catch (error) {
            console.log(error);
            return next(ApiError.badRequest('Ошибка при отправлении запроса в друзья'));
        }
    }

};

module.exports = new FriendController();