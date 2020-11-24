const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');
const Moment = require('jalali-moment')


//configure prefix routing 
express.application.prefix = express.Router.prefix = function (path, configure) {
    var router = express.Router();
    this.use(path, router);
    configure(router);
    return router;
};


const port = 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server , {
    cors: {
      origin: '*',
    }
});



app.use(cors());

app.use(express.static("public"));

require('./routes/Router')(app , io)


let interval;


/* io.on("connection", (socket) => {

    console.log(socket.id);
    console.log("New client connected");

    socket.emit('FromAPI' , 'hellow front');

    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
    socket.emit('FromAPI' ,  {time : Moment().format('HH:mm:ss')})

    }, 1000);
    socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
    });

    
});
 */






server.listen(port , () => console.log(`Listening on port ${port}`));