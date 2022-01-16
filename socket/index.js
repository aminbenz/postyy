const {
   joinRoom,
   userLeave,
   getUser_ROOM,
   getUsersInRoom,
   usersInRoom,
} = require('./room');
let onlineUsers = [];

const addUniqueUser = (userId, socketId) => {
   if (userId) {
      !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId });
   }
};

const getUser = (userId) => {
   return onlineUsers.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

module.exports = function(io) {
   io.on('connection', (socket) => {
      console.log('a user connected');
   
      //take userId and socketId from User
      socket.on('addUser', (userId) => {
         addUniqueUser(userId, socket.id);
         io.emit('getUsers', onlineUsers);
      });
   
      //---------------------------- Notification ------------------
      socket.on(
         'sendNotification',
         ({
            senderId,
            senderName,
            senderImg,
            receiverId,
            actionType,
            objectName,
            ref,
            time,
         }) => {
            const receiver = getUser(receiverId);
            if(receiver){
               io.to(receiver.socketId).emit('getNotification', {
                  senderName,
                  senderImg,
                  actionType,
                  objectName,
                  ref,
                  time,
               });
            }
         }
      );
   
      //---------------------------------- Private Chat Messages ----------------------------------
   
      // user typing
      socket.on('startTyping', ({ typing, senderId, reciverId }) => {
         const user = getUser(reciverId);
         io.to(user?.socketId).emit('isTyping', { typing, senderId });
      });
   
      // user stop typing
      socket.on('stopTyping', ({ typing, senderId, reciverId }) => {
         const user = getUser(reciverId);
         io.to(user?.socketId).emit('isTyping', { typing, senderId });
      });
   
      // send and get message
      socket.on(
         'sendMessage',
         ({ senderId, reciverId, text, conversation }) => {
            const user = getUser(reciverId);
            io.to(user?.socketId).emit('getMessage', {
               senderId,
               text,
               conversation,
            });
            io.to(user?.socketId).emit('isTyping', { typing: false });
         }
      );
   
      socket.on('removeMessage', (messageId) => {
         const user = getUser(reciverId);
         io.to(user?.socketId).emit('getMessageToDelete', messageId);
      });
   
      //  ----------------------------------------- ROOM --------------------------------
      socket.on('join room', ({ name, room }, callback) => {
         const { error, user } = joinRoom({
            id: socket.id,
            name,
            room,
         });
   
         if (error) return callback(error);
   
         socket.join(user.room);
   
         // when user connect send him welcome message
         socket.emit('message room', {
            user: 'admin',
            text: `${user.name} , welcome to the room ${user.room}`,
         });
   
         // broadcast when user disconnect
         socket.broadcast.to(user.room).emit('message room', {
            user: 'admin',
            text: `${user.name} , has joined!`,
         });
   
         // Room Data : Users & Room Name
         io.to(user?.room).emit('roomData', {
            room: user.room,
            onlineUsers: getUsersInRoom(user.room),
         });
   
         callback();
      });
   
      socket.on('sendMessage room', (message, callback) => {
         const user = getUser_ROOM(socket?.id);
   
         io.to(user.room).emit('message room', {
            user: user.name,
            text: message,
            createdAt: Date.now(),
         });
   
         callback();
      });
   
      //  -------------------------------- VIDEO CHAT ------------------
   
   let userInVideoChat = [];
   
   const addUserToVideoChat = (userId, socketId) => {
         !userInVideoChat.some((user) => user.userId === userId) &&
         userInVideoChat.push({ userId, socketId });
   };
   
        //take userId and socketId from User
        socket.on('joinToVideoChat', (userId) => {
         addUserToVideoChat(userId, socket.id);
         io.emit('getUsersInVideoChat', userInVideoChat);
      });
   
      socket.emit("me" ,socket.id )
   
      // call user
      socket.on('callUser', ({ userToCall, signData, from, name }) => {
         io.to(userToCall).emit('callUser', {
            signal: signData,
            from,
            name,
         });
      });
   
      socket.on('answerCall', (data) => {
         io.to(data.to).emit('callAccepted', data.signal);
      });

      //  -------------------------------- COMMENT ------------------
// socket.broadcast.emit();
// socket.on('isTyping comment', (data) => {
//    io.to(data.to).emit('callAccepted', data.signal);
//    io.broadcast.emit();
// });
   
      // when disconnect
      socket.on('disconnect', () => {
         console.log('a user disconnected !');
         removeUser(socket.id);
         io.emit('getUsers', onlineUsers);
   
         //leave from video chat
         socket.broadcast.emit("calended")
   
         // disconnect room
         const user = userLeave(socket.id);
         if (user) {
            io.to(user.room).emit('message room', {
               user: 'admin',
               text: `${user.name} has left the chat`,
            });
            // Room Data : Users & Room Name
            io.to(user.room).emit('roomData', {
               room: user.room,
               onlineUsers: getUsersInRoom(user.room),
            });
         }
      });
   });
};


