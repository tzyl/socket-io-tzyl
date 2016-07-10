// var nickname = prompt('Enter your nickname:');
var nickname;
var userList = [];
var isScrolledToBottom;
var socket = io();

socket.on('login successful', function() {
    $('.login-screen').fadeOut();
    $('.chat-room').fadeIn();
});

socket.on('invalid nickname', function() {
    console.log('Nickname already taken!');
})

socket.on('user joined', function(data) {
    addMsg(data.nickname + ' joined');
});

socket.on('user left', function(data) {
    addMsg(data.nickname + ' left');
});

// Receive message from server.
socket.on('chat message', function(msg) {
    console.log(msg);
    // $('#messages').append($('<li>').text(msg));
    addMsg(msg);
});

// Handle login form submit.
$('.login-form').submit(function() {
    nickname = $('.login-form input').val();
    if (nickname) {
        socket.emit('login', nickname);
    }
    return false;
})

// Handle message box submit.
$('.message-form').submit(function() {
    var date = new Date();
    var msg = $('#message-input').val();
    if (msg) {
        msg = date.toLocaleString() + ' ' + nickname + ' : ' + msg;
        socket.emit('chat message', msg);
        // $('#messages').append($('<li>').text(msg));
        addMsg(msg);
        $('#message-input').val('');
    }
    return false;
});

// Adds message to client's screen and also scrolls to bottom if the page was already at the bottom.
function addMsg(msg) {
    isScrolledToBottom = $('#messages')[0].scrollHeight - $('#messages').scrollTop() === $('#messages').innerHeight();
    $('#messages').append($('<li>').text(msg));
    if (isScrolledToBottom) {
        $('#messages').scrollTop($('#messages')[0].scrollHeight - $('#messages').innerHeight());
        // document.body.scrollTop = document.body.scrollHeight - window.innerHeight;
        // $('html, body').animate({ scrollTop: document.body.scrollHeight - window.innerHeight }, 'fast');
    }
}
