let usersInRoom = [];

const joinRoom = ({ id, name, room }) => {
   name = name.trim().toLowerCase();
   room = room.trim().toLowerCase();

   const existingUser = usersInRoom.find(
      (user) => user.name === name && user.room === room
   );

   if (existingUser) {
      return { error: 'Username is taken' };
   }
   const user = { id, name, room };

   usersInRoom.push(user);
   return { user };
};

const userLeave = (id) => {
   const index = usersInRoom.findIndex((user) => user.id === id);
   if (index !== -1) {
      return usersInRoom.splice(index, 1)[0];
   }
};

const getUser_ROOM = (id) =>
   usersInRoom.find((user) => user.id === id);

const getUsersInRoom = (room) =>
   usersInRoom.filter((user) => user.room === room);

// Video Chat

module.exports = {
   joinRoom,
   userLeave,
   getUser_ROOM,
   getUsersInRoom,
   usersInRoom,
};
