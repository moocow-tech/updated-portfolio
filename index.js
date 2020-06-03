const express = require('express');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const PORT = 5050;
const server = app.listen(PORT, ()=> {
    console.log("Server is running");
})
const io = require('socket.io')(server);
//  TODO IMPORTANT need to validate form submission
const expressValidator = require("express-validator");
const helmet = require("helmet");
const publicDir = path.join(__dirname, 'public')
app.use(cors());
//  TODO IMPORTANT need to add persmissions for cors
app.use(bodyParser.urlencoded({ extended:true }));
app.use(helmet());
app.use(bodyParser.json());
redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});
app.use(session({
    secret:'sessionstorageWithRedis',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "false" },
    store: new redisStore({client: redisClient}),
}));
app.use(express.static(publicDir)); 

// app.get('/', (req, res)=> {
//     res.send("OK");
// });
const routes = require('./routes/appRoutes');
const sockets = require('./sockets/socket.js');
routes(app);
sockets(io);





