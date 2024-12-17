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

User.hasMany(FavoriteGame); 
FavoriteGame.belongsTo(User); 

Game.hasMany(FavoriteGame); 
FavoriteGame.belongsTo(Game); 

Game.belongsToMany(Genre, { through: 'game_genre', foreignKey: 'gameId' });
Genre.belongsToMany(Game, { through: 'game_genre', foreignKey: 'genreId' });

module.exports = {
    User, Game, Genre, FavoriteGame
};