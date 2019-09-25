let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let rooms = {};
let connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server running");


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected, %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function(data){
        
        if(socket.username){
            delete rooms[socket.room].splice(socket.username, 1);
            updateUsernames();
    
            if(rooms[socket.room].length == 0){
                delete rooms[socket.room];
            }
        }

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected, %s sockets connected', connections.length);
    });

    
    //New room
    socket.on('new room', function(callback){
        let roomCheck = true;
        let roomNumber = 0;
        
        do{
            roomNumber = Math.floor(100000 + Math.random() * 900000);
            
            if(roomNumber in rooms){
                roomCheck = false;
            }
            
        } while(!roomCheck);
        
        callback(true);
        socket.room = roomNumber;
        socket.emit('get room', socket.room);
        rooms[roomNumber] = [];
        
        console.log("Room " + roomNumber + " created.");
    });
    
    //Join room
    socket.on('join room', function(data, callback){
        let roomCheck = false;
        
        if(data in rooms){
            roomCheck = true;
            socket.room = data;
            console.log("A user joined room " + data + ".");
        }
        
        callback(roomCheck);
        
        socket.emit('get room', socket.room);
        
    });
    
    //Send message
    socket.on('send message', function(data, roomNumber){
        for(let i = 0; i < connections.length; i++){
            if(connections[i].room == roomNumber){
                connections[i].emit('new message', {msg: data, user: socket.username});
            }
        }
    });
    
    //New user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        rooms[socket.room].push(data);
        updateUsernames();
    });
    
    function updateUsernames(){
        
        for(let i = 0; i < connections.length; i++){
            connections[i].emit('get users', rooms[connections[i].room]);
        }
    }
    
});