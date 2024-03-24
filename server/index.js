const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const {
  redisClient,
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  isUserInRoom,
} = require("./config/redisClient");

const { allowedOrigins } = require("./config/config");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

global.io=io;

const usersToSocket = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  /* ============ROOM EVENTS============ */

  socket.on("room:join", async (data) => {
    const { roomId, user } = data;
    socket.join("room_" + roomId);

    // User already connected through other socket, we disconnect that connection
    if (usersToSocket[user.id]) {
      const prevSocketId = usersToSocket[user.id].socketId;

      if (io.sockets.sockets.has(prevSocketId)) {
        io.sockets.sockets.get(prevSocketId).disconnect(true);
      }
    }

    // await isUserInRoom(roomId, user.id, (socketId) => {
    //   io.sockets.sockets.get(socketId).disconnect(true);
    // });

    usersToSocket[user.id] = { socketId: socket.id };
    await addUserToRoom(roomId, { ...user, socketId: socket.id });

    socket.to(`room_${roomId}`).emit("user:join", user);

    getUsersInRoom(roomId,(users)=>
    {
      io.to(`room_${roomId}`).emit("room:users", { users: users });
    });
  });

  socket.on("user:left", async ({ roomId, userId }) => {
    // console.log(roomId,userId,socket.id);
    delete usersToSocket[userId];
    await removeUserFromRoom(roomId, userId);
  });

  /* ============CURSOR && CANVAS EVENTS============ */

  socket.on("cursor:update", (data) => {
    const roomId = Array.from(socket.rooms)[1];
    socket.to(roomId).emit("cursor:update", data);
  });

  socket.on("cursor:leave", (data) => {
    const roomId = Array.from(socket.rooms)[1];
    socket.to(roomId).emit("cursor:leave", data);
  });

  socket.on("canvas:update", async (data) => {
    const roomId = Array.from(socket.rooms)[1];
    socket.to(roomId).emit("canvas:update", data);
  });

  socket.on("svg:drawing", (data) => {
    const roomId = Array.from(socket.rooms)[1];
    socket.to(roomId).emit("svg:drawing", data);
  });

  /* ============CODE EDITOR EVENTS============ */
  socket.on("code:change", (data) => {
    const roomId = Array.from(socket.rooms)[1];
    socket.to(roomId).emit("code:change", data);
  });

  socket.on("code:cursor", (data) => {
    const roomId = Array.from(socket.rooms)[1];
    socket.to(roomId).emit("code:cursor", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`API running on PORT:${port}`);
});