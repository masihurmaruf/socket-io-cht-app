/**
 * Created by masihur on 3/5/17.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

server.listen(process.env.PORT || 3000);
console.log("server is running ... ")

app.get('/', function(req, res){
   res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
   connections.push(socket);
   console.log('Connected: %s sockets connected', connections.length);

   socket.on('disconnect', function(data){
       users.splice(users.indexOf(socket.userName), 1);
       updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);

    });

    socket.on('send message', function(data){
        // console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.userName});
    });

    socket.on('new user', function(data, callback){
        callback(true);
        socket.userName = data;
        users.push(socket.userName);
        updateUserNames();
    });

    function updateUserNames() {
        io.sockets.emit('get users', users);
    }
});
