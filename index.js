var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    io.emit('chat message', 'User connected');

    socket.on('disconnect', function(){
        io.emit('chat message', 'User disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        // io.emit('chat message', msg);
        socket.broadcast.emit('chat message', msg); // Don't send message to self. Instead we show the message client side.
    });
});

http.listen(app.get('port'), function(){
    console.log('listening on port:', app.get('port'));
});
