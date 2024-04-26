import express from "express";
import { Server } from 'socket.io';
import { urlencoded, static as staticMiddleware } from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import { arch } from "os";

// start code

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(urlencoded({ extended: true }));

app.set('views', join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(staticMiddleware(join(__dirname, "public")));

const server = app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});

const io = new Server(server, {
    connectionStateRecovery: {}
});

io.on('connection', (socket) => {
    console.log("a user connected");
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
    });


    socket.join('some room');
    
    // broadcast to all connected clients in the room
    io.to('some room').emit('hello', 'world');
  
    // broadcast to all connected clients except those in the room
    io.except('some room').emit('hello', 'world');
  
    // leave the room
    socket.leave('some room');


});



app.get("/", (req, res) => {
    res.render("index.ejs");
});
