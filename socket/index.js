const { SOCKET } = require('../common');
class Socket {
    constructor(server) {
        const io = require('socket.io')(server);

        io.on(SOCKET.CONNECTION, function (socket) {
            console.log('A user connected');
            var defaultRoom = 'adminRoom';
            var admin = 'nhlong2@tma.com.vn';
            socket.on(SOCKET.CREATE, function (username) {
                socket.join(defaultRoom);

                let cmd = username == admin ? SOCKET.IN_CHAT : SOCKET.CHAT;
                let data = {
                    username: username,
                    message: 'Joined room!'
                };

                io.sockets.in(defaultRoom).emit(cmd, data);
            });

            socket.on(SOCKET.CHAT, function (data) {
                if (data.username == admin) {
                    data.username = 'admin';
                }

                io.sockets.in(defaultRoom).emit(SOCKET.CHAT, data);
            });

            socket.on(SOCKET.IN_CHAT, function (msg) {
                console.log(msg);
                socket.emit(SOCKET.IN_CHAT, msg);
            });
        });
    }
}

module.exports = (server) => { return new Socket(server) };