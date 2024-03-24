const { createClient } = require("redis");

const redisClient = createClient();

async function connectToRedisClient() {
  try {
    await redisClient.connect();
    console.log(`Connected to Redis Client`);
  } catch (err) {
    console.log(`Error Connecting to Redis Client`, err);
  }
}

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

function addUserToRoom(roomId, user) {
  redisClient.hSet(
    `room:${roomId}:users`,
    user.id,
    JSON.stringify(user),
    (err, reply) => {
      if (err) {
        console.error("Error adding user to room in Redis:", err);
      } else {
        console.log(`User ${user.id} added to room ${roomId} in Redis`);
      }
    }
  );
}

function removeUserFromRoom(roomId, userId) {
  redisClient.hDel(`room:${roomId}:users`, userId, (err, reply) => {
    if (err) {
      console.error("Error removing user from room in Redis:", err);
    } else {
      console.log(`User ${userId} removed from room ${roomId} in Redis`);
    }
  });
}

function getUsersInRoom(roomId, callback) {
  redisClient.hGetAll(`room:${roomId}:users`, (err, users) => {
    if (err) {
      console.error("Error getting users in room in Redis:", err);
      callback([]);
    } else {
      const parsedUsers = Object.values(users).map((user) => JSON.parse(user));
      callback(parsedUsers);
    }
  });
}

function isUserInRoom(roomId, userId, callback) {
  redisClient.hGet(`room:${roomId}:users`, userId, (err, userData) => {
    if (err) {
      console.error("Error checking user in room from Redis:", err);
      callback(null);
    } else {
      const user = JSON.parse(userData);
      if (user && user.socketId) {
        callback(user.socketId);
      } else {
        callback(null);
        s;
      }
    }
  });
}

module.exports = {
  redisClient,
  connectToRedisClient,
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  isUserInRoom,
};
