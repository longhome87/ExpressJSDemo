const { SOCKET } = require('../common');
class Socket {
    constructor(server) {
        const io = require('socket.io')(server);

        io.on(SOCKET.CONNECTION, function (socket) {
            console.log('A user connected');
            var defaultRoom = 'adminRoom';
            socket.on(SOCKET.CREATE, function (user) {
                socket.join(defaultRoom);

                let cmd = user == 'admin' ? SOCKET.IN_CHAT : SOCKET.CHAT;
                let text = user + ' joined room!';
                console.log(text);
                io.sockets.in(defaultRoom).emit(cmd, text);
            });

            socket.on(SOCKET.CHAT, function (msg) {
                console.log(msg);
                io.sockets.in(defaultRoom).emit(SOCKET.CHAT, msg);
            });

            socket.on(SOCKET.IN_CHAT, function (msg) {
                console.log(msg);
                socket.emit(SOCKET.IN_CHAT, msg);
            });
        });
    }
}

module.exports = (server) => { return new Socket(server) };