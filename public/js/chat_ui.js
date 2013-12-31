function liEscapedContentElement(message) {
    return $('<li class="list-group-item list-group-item-message"></li>').text(message);
}
function liSystemContentElement(message) {
    return $('<li class="list-group-item list-group-item-message systemMsg"></li>').html(message);
}

function startChat(chatApp, socket) {
    var nickname = $('#nickname').val();
    var room = $('.roomToEnter').find(":selected").text();

    chatApp.joinChat(nickname, room);
}

function processUserInput(chatApp, socket) {
    var message = $('#send-message').val();
    var systemMessage;
    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if (systemMessage) {
            $('#messages').append(liSystemContentElement(systemMessage));
        }
    } else {
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(liEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

function updateData() {
    //fix
    $('#currentRoom').html($('.roomToEnter').find(":selected").text());
    socket.emit('rooms');
    //allRooms
}

var socket = io.connect();
$(document).ready(function() {
    var chatApp = new Chat(socket);
    socket.on('nameResult', function (result) {
        var message;
        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#messages').append(liSystemContentElement(message));
    });
    socket.on('joinResult', function (result) {
        $('#room').text(result.room);
        $('#messages').append(liSystemContentElement('Room changed.'));
    });
    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });
    socket.on('rooms', function (rooms) {
        //change to class
        $('#room-list').empty();
        for (var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                var liElement = liEscapedContentElement(room);
                $('#room-list').append(liElement);
            }
        }
        $('#room-list div').click(function () {
            chatApp.processCommand('/join ' + $(this).text());
            $('#send-message').focus();
        });
    });
    setInterval(function () {
        socket.emit('rooms');
    }, 1000);
    $('#send-message').focus();
    $('#send-form').submit(function () {
        processUserInput(chatApp, socket);
        return false;
    });

    $('#joinChat').click(function () {
        startChat(chatApp, socket);
        $('#chatWindow').show();
        $('#introChat').hide();
        updateData();

        
    });
});
