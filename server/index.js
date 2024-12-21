const express = require('express');
const PORT = process.env.PORT || 9000;
const cors = require('cors');
const sequelize = require('./db');
const router = require('./routes/index');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();


const allowOrigin = "http://localhost:5173";
app.use(cors({
    origin: allowOrigin, 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({
    createParentPath: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB is ready');

        console.log('DB name:', sequelize.getDatabaseName());

        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();

