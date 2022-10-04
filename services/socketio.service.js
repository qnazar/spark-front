import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection() {
        this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

        this.socket.emit('connection', 'connecting...');
    }

    disconnect(username) {
        // this.socket.emit('disconnect');

        if (this.socket) {
            this.socket.disconnect(username);
        }
    }

    loginUser(username, password) {
        this.socket.emit('login', {'username': username, 'password': password})
    }

    addChat(currentUser, toUser) {
        this.socket.emit('add chat', {'current_user': currentUser, 'to_user': toUser})
    }

    sendMsg(message, sender, destination) {
        this.socket.emit('message', {'message': message, 'sender': sender, 'to': destination})
    }
}

export default new SocketioService();