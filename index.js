/**********
 *  DRIVE Server Code
 *  Authors: Rudy DeSanti, Kyle Witham, Roderick Ramirez
 *  Purpose of this server is to transfer data between clients needed to establish video connections.
 *  Last Updated: January 25, 2022
 *  Type "node index.js" in terminal to start server on port 3000.
 */

//Get packages, create server
const static = require('node-static');
const http = require('http');
const file = new(static.Server)();
const { Server } = require("socket.io");


//Create server app, listening on port 3000
const app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(3000, ()=>{
  console.log('Listening on 3000');
});

const io = new Server(app);
//On connection to server
io.on('connection', (socket) => {

  var anotherSocketId = '';
  console.log('In socket: ',socket.id);

  //When a JSON message is recieved by socket, parse it to find which type of message it is.
  socket.on('message', (message) => {

    data = JSON.parse(message);

    //Different case for each type of message: Login, Offer, Answer, Candidate, Leave
    switch (data.type) {
      //When a user is loging into their account, set their socket's name attribute equal to their UserID. 
      //The name attribute is used for finding the websockets of other clients.

      case 'login':
        //Automatically join empty room based off of socket.id.
        console.log('Login');
        console.log("Logging in ID: ", socket.id);
        socket.name = data.name;
        console.log("Socket name: ", socket.name);
        console.log("New Socket ID: ", socket.id);
        break;

      //When an offer is sent for establishing a video connection by a user.
      //Send data from original client to the requested client.
      case 'offer':
        console.log("Socket sending offer: ", socket.id, socket.name);

        //Find the socket with the target name given in the message data. Then, update data name to current socket, send to target client.
        anotherSocketId = getSocketsProperty('name',data.name);
        data.name = socket.name;

        //Stringify new data as JSON, send it to requested client.
        message = JSON.stringify(data);
        console.log("Offer message: ", message)
        console.log("Sending offer to: ", anotherSocketId);
        io.to(anotherSocketId).emit('message', message);
        anotherSocketId = '';

        console.log('Offer');
        break;

      //Send the data of the answer to an offer to the client who sent the offer.
      case 'answer':

        //Print to server console for debugging purposes.
        console.log("Socket sending answer: ", socket.id, socket.name);
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log('Sending answer too: ', anotherSocketId);

        //Get socket to send to, send answer to that socket.
        io.to(anotherSocketId).emit('message', message);
        anotherSocketId = '';
        console.log('Answer');
        break;

      //When two clients have sent an offer, and the offer was answered yes, send candidate date to the client who gave the answer.
      //The candidate data establishes which ICE server to use to establish a video connection.
      case 'candidate':

        //Print to server console for debugging purposes.
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log('anotherSocketID from Candiate: ', anotherSocketId);
        
        //Send message to other client.
        io.to(anotherSocketId).emit("message", message);
        anotherSocketId = '';
        console.log('Candidate');
        break;

      //When a call is ended. Is not meant for socket disconnection, just call disconnection. Telling a client to leave a video call.
      case 'leave':
        //Get the target device to send the leave message to.
        //No need to change taret socket name, as the leave only goes one way. Just send back same message.
        anotherSocketId = getSocketsProperty('name',data.name);
        io.to(anotherSocketId).emit("message", message);
        anotherSocketId = '';
        console.log('Leave');
        break;
      
      //Viewer sends commands to broadcaster cases
      //|| 'lookDown' || 'lookRight' || 'lookLeft' || 'zoomIn' || 'zoomOut' || 'lookUpLeftCorner' || 'lookUpRightCorner'||'lookDownLeftCorner'||'lookDownRightCorner':
      case 'lookUp':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'lookDown':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;
      
      case 'lookLeft':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'lookRight':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'lookUpRightCorner':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'lookDownRightCorner':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'lookUpLeftCorner':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'lookDownLeftCorner':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'zoomIn':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'zoomOut':
        anotherSocketId = getSocketsProperty('name',data.name);
        console.log("Socket: " + anotherSocketId);
        io.to(anotherSocketId).emit("message", message);
        console.log(data.type)
        anotherSocketId = '';
        break;

      case 'switchRoles':
          anotherSocketId = getSocketsProperty('name',data.name);
          console.log("Socket: " + anotherSocketId);
          io.to(anotherSocketId).emit("message", message);
          console.log(data.type)
          anotherSocketId = '';
          break;
          
      default:
        break;
    }

    //Socket disconnected.
    socket.on("disconnect", (reason) => {
      //console.log(socket.id);
      socket.disconnect();
      console.log("Socket disconnected: ", socket.id);
    });
  });

  /* Unused function 
  function listSocketsProperty(myProperty){
    let sck = io.sockets.sockets
    const mapIter = sck.entries()
    while(1){
      console.log("Map: ", mapIter);
      let en = mapIter.next().value?.[0]
      if(en) console.log( sck.get(en)[myProperty] )
      else break
    }
  }
  */

  //Return socket id based off of a property. Used to fins socket ID based off of name attribute.
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
});
