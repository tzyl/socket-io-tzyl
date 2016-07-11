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
    $('.login-alert').addClass('in');
});

socket.on('user joined', function(data) {
    addMsg(data.nickname + ' joined');
    updateUserList(data.userList);
});

socket.on('user left', function(data) {
    addMsg(data.nickname + ' left');
    updateUserList(data.userList);
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

// Update list of nicknames of current connected users.
function updateUserList(nicknames) {
    var $userListDiv = $('.user-list');
    var $userList;
    $userListDiv.empty();
    $userListDiv.append('<span class="user-count">' + nicknames.length + ' users currently connected</span>');
    $userList = $('<ul></ul>').appendTo($userListDiv);
    for (var i = 0; i < nicknames.length; i++) {
        $userList.append('<li>' + nicknames[i] + '</li>');
    }
}

// Function to hide alert on clicking close button.
$(function(){
    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).removeClass('in');
    });
});
