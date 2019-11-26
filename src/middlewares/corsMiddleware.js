import cors from "cors";
import express from "express";
var app = express();

//FIXES CORS ERROR
var whiteList = [
    'http://localhost:3000',
    'http://tungtung.vn',
    '*'
];

var corsOptions = {
    origin: (origin, callback) => {
        if (app.get('env') === 'production') {
            var originIsWhiteListed = whiteList.indexOf(origin) !== -1;
            callback(null, originIsWhiteListed);
        } else {
            callback(null, true);
        }
    },
    credentials: true
};

export default cors(corsOptions);