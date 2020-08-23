const http = require('http');
const socketIO  = require('socket.io');
const path = require('path');
const express = require('express');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);  // express library does this behind the scenes anyways

const io = socketIO(server);
const port = process.env.port || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

const retros = {};

io.on('connection', (socket) => { // called when a new client is opened
    socket.on('join', ({ username, room}, callBack) => {
        const { error, user} = addUser({
            id: socket.id, username, room
        });

        if(error) {
            return callBack(error)
        }
        if(!retros[room]) {
            retros[room] = {
                'went-well': [],
                'to-improve': [],
                'action-items': [],
            };
        }
        socket.join(user.room)
        socket.broadcast.to(user.room).emit('new user', user.username); // send to all client except the one that is just joined
        socket.emit('retro-items', retros[room]);
        io.to(user.room).emit('room-data', {
            room: user.room,
            users: getUsersInRoom(user.room),
        });
        callBack();
        //io.to.emit //send to all client in same room
    });

    socket.on("sendMessage", (message, callBack) => {
        io.to().emit("message", message);
        callBack();
    })
    
    socket.on('send-retro-item', ({category, message}, callBack) => {
        const user = getUser(socket.id);
        const formattedMessage = `[${user.username}]-${message}`;
        retros[user.room][category] = retros[user.room][category].concat(formattedMessage);
        io.to(user.room).emit('retro-item', {
            category, message: formattedMessage
        });
        callBack();
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('user left', `${user.username} has left`);
            io.to(user.room).emit('room-data', {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

