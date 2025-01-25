const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    avatar_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null }
});

const Game = sequelize.define('game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    popularity_score: { type: DataTypes.INTEGER, defaultValue: 0 },
    file_url: { type: DataTypes.STRING, allowNull: false },
    preview_url: { type: DataTypes.STRING, allowNull: true }
});

const Genre = sequelize.define('genre', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

const FavoriteGame = sequelize.define('favorite_game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
    indexes: [
        {
            unique: true,
            fields: ['userId', 'gameId'] // Уникальность пары (пользователь, игра)
        }
    ]
});

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false }
});

const Friend = sequelize.define('friend', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

const Message = sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    edited: { type: DataTypes.BOOLEAN, defaultValue: false },
    senderId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'users', key: 'id' }
    },
    receiverId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'users', key: 'id' }
    }
});

const Notification = sequelize.define('notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    seen: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: { model: 'users', key: 'id' }
    },
    from: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        defaultValue: null
    }
});

User.hasMany(FavoriteGame);
FavoriteGame.belongsTo(User);

Game.hasMany(FavoriteGame);
FavoriteGame.belongsTo(Game);

Game.belongsToMany(Genre, { through: 'game_genre', foreignKey: 'gameId' });
Genre.belongsToMany(Game, { through: 'game_genre', foreignKey: 'genreId' });

User.hasMany(Comment);
Comment.belongsTo(User);

Game.hasMany(Comment);
Comment.belongsTo(Game);

User.hasMany(Friend, { foreignKey: 'userId' });
User.hasMany(Friend, { foreignKey: 'friendId' });

User.belongsToMany(User, { 
    through: 'friend', 
    foreignKey: 'userId', 
    otherKey: 'friendId', 
    as: 'Friends' // Друзья пользователя
});

User.belongsToMany(User, { 
    through: 'friend', 
    foreignKey: 'friendId', 
    otherKey: 'userId', 
    as: 'FriendOf' // Те, кто является другом пользователя
});

User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

User.hasMany(Message, { foreignKey: 'receiverId' });
Message.belongsTo(User, { foreignKey: 'receiverId' });

User.hasMany(Notification);
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User, Game, Genre, FavoriteGame, Comment, Friend, Message, Notification
};