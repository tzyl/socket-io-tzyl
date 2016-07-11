var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = {};

app.set('port', (process.env.PORT || 5000));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

// Routing
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    var addedUser = false;
    var nickname;

    // Try to log in user with chosen nickname.
    socket.on('login', function(name) {
        var validName = checkValidName(name, clients);
        if (!validName) {
            socket.emit('invalid nickname');
        } else {
            addedUser = true;
            nickname = name;
            clients[socket.id] = {socket: socket, nickname: nickname};
            console.log(clients);
            socket.emit('login successful');
            io.emit('user joined', {nickname: nickname, userList: getNicknames(clients)});
        }
    });

    // socket.on('nickname', function(name) {
    //     clients[socket.id].nickname = name;
    // });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        // io.emit('chat message', msg);
        socket.broadcast.emit('chat message', msg); // Don't send message to self. Instead we show the message client side.
    });

    socket.on('disconnect', function(){
        if (addedUser) {
            delete clients[socket.id];
            console.log(clients);
            socket.broadcast.emit('user left', {nickname: nickname, userList: getNicknames(clients)});
        }
        // io.emit('chat message', clients[socket.id].nickname + ' disconnected');
        // delete clients[socket.id];
    });
});

http.listen(app.get('port'), function(){
    console.log('listening on port:', app.get('port'));
});

// Gets array of nicknames from clients object.
function getNicknames(clients) {
    var nicknames = []
    for (var client in clients) {
        if (clients.hasOwnProperty(client)) nicknames.push(clients[client].nickname);
    }
    return nicknames
}

// Checks if nickname is taken already.
function checkValidName(name, clients) {
    for (var client in clients) {
        if (clients.hasOwnProperty(client)) {
            if (clients[client].nickname == name) {
                return false;
            }
        }
    }
    return true;
}
