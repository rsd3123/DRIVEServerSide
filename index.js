/*
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1');
});

io.on('connection',(socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
*/
const static = require('node-static');
const http = require('http');
const file = new(static.Server)();
const { Server } = require("socket.io");
const app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(3000, ()=>{
  console.log('Listening on 3000');
});

const io = new Server(app);

io.on('connection', (socket) => {
  var anotherSocketId = '';
  console.log('In socket: ',socket.id);
  /*
  console.log("connected sockets-----:");
  listSocketsProperty('id');
  console.log("------------------");
  */

  //When message is recieved by socket
  socket.on('message', (message) => {
    data = JSON.parse(message);
    switch (data.type) {
      case 'login':
        //Automatically join empty room based off of socket.id
        console.log('Login');
        console.log("Logging in ID: ", socket.id);
        socket.data.name = data.name;
        console.log(socket.data.name);
        break;
      //when somebody wants to call us
      case 'offer':
        console.log("Socket sending offer: ", socket.id);
        //Sends nameid of person offer is for, the offer, and type = offer
        anotherSocketId = getSocketsProperty('name',data.name);
        //socket.to(anotherSocketId).emit('offer', message);
        console.log("Sending offer to: ", socket.id);
        console.log("Offer message sending: ", message);
        io.to(socket.id).emit('message', message);
        anotherSocketId = '';
        console.log('Offer');
        break;
      case 'answer':
        //If answer = yes, join room of caller. If answer = no, dont join room, stay in current room.
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log('anotherSocketID from Answer: ', anotherSocketId);
        //message = JSON.stringify(data)
        socket.to(anotherSocketId).emit('message', message);
        anotherSocketId = '';
        console.log('Answer');
        break;
      //when a remote peer sends an ice candidate to us
      case 'candidate':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log('anotherSocketID from Candiate: ', anotherSocketId);
        //message = JSON.stringify(data)
        socket.to(anotherSocketId).emit("message", message);
        anotherSocketId = '';
        console.log('Candidate');
        break;
      case 'leave':
        //socket.to(anotherSocketId).emit("leave", socket.id, message);
        //Disconnect socket from current room
        console.log('Leave');
        socket.disconnect();
        break;
      default:
        break;
    }

    //Socket disconnected.
    socket.on("disconnect", (reason) => {
      //console.log(socket.id);
      console.log("Socket disconnected: ", socket.id);
    });
  });

  function listSocketsProperty(myProperty){
    let sck = io.sockets.sockets
    const mapIter = sck.entries()
    while(1){
      let en = mapIter.next().value?.[0]
      if(en) console.log( sck.get(en)[myProperty] )
      else break
    }
  }

  //Return socket id based off of a property
  function getSocketsProperty(property, target){
    let sck = io.sockets.sockets
    const mapIter = sck.entries()
    while(1){
      let en = mapIter.next().value?.[0]
      if(en)  
      {
        if(sck.get(en)[property] == target)
        {
          return sck.get(en)['id'];
        }
      } 
      else break
    }
  }

  /*
  socket.on('create or join', (room) => {
    const numClients = io.sockets.clients(room).length;

    console.log('Room ' + room + ' has ' + numClients + ' client(s)');
    console.log('Request to create or join room ' + room);

    if (numClients === 0){
      socket.join(room);
      socket.emit('created', room);
    } else if (numClients === 1) {
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room);
    } else { // max two clients
      socket.emit('full', room);
    }
    socket.emit('emit(): client ' + socket.id +
      ' joined room ' + room);
    socket.broadcast.emit('broadcast(): client ' + socket.id +
      ' joined room ' + room);

  });
  */
});
