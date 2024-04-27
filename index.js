import express from "express";
import { Server } from 'socket.io';
import { urlencoded, static as staticMiddleware } from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import bodyParser from "body-parser";
// start code

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(urlencoded({ extended: true }));

app.set('views', join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(staticMiddleware(join(__dirname, "public")));

const server = app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});

const io = new Server(server, {
    connectionStateRecovery: {}
});

var users = 0;

io.on('connection', (socket) => {
    users++;
    console.log(`a user connected user no: ${users}`);
    io.emit('userCount', users);

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    

    socket.on('hi', (args) =>{
        console.log(args);
    })
    socket.on('hello', (arg) => {
        console.log(arg); // 'world'
      });
    socket.on('disconnect',()=>{
        console.log('user disconnected');
        users--;
        io.emit('userCount', users);

    });


    socket.join('some room');
    
    // broadcast to all connected clients in the room
    io.to('some room').emit('hello', 'world');
  
    // broadcast to all connected clients except those in the room
    io.except('some room').emit('hello', 'world');
  
    // leave the room
    socket.leave('some room');


});

var usernamedisplay = '';

app.post("/login", (req, res) => {
    usernamedisplay = req.body.username;
    res.redirect("/GetIn");
});


app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/GetIn", (req, res) =>{
    res.render("index.ejs", {
        Username: usernamedisplay
    })
})
