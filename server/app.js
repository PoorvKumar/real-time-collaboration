require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const { createClient }=require("redis");
const { allowedOrigins } = require("./config/config");

const errorMiddleware=require("./middlewares/errorMiddleware");

// REDIS
const client = createClient();

client
  .connect()
  .then(() => {
    console.log("Redis Connected");
  })
  .catch((err) => {
    console.log("Error Connecting to Redis client", err);
  });

  // client.on("connect", () => {
  //   console.log("Connected to Redis");
  // });

  client.on("error", (err) => {
    console.error("Redis error:", err);
  });

// Routers
const authRouter=require("./routers/authRouter");
const userRouter=require("./routers/userRouter");
const teamRouter=require("./routers/teamRouter");

//Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME,
  })
  .then(() => {
    console.log("Connected to MongoDB",process.env.MONGO_DB_NAME);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware Functions
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  return res.json({ msg: "Server running!" });
});

app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/teams",teamRouter);

app.use((req,res,next)=>
{
  return res.status(404).json({ msg: "Route not found" });
});

app.use(errorMiddleware);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("room:join",(workspaceId)=>
  {
    socket.join("workspace_"+workspaceId);
  });

  socket.on("user:join",(data)=>
  {
    const roomId=Array.from(socket.rooms)[1];
    socket.to(roomId).emit("user:join",data);
  });

  socket.on("cursor:update",(data)=>
  {
    const roomId=Array.from(socket.rooms)[1];
    socket.to(roomId).emit("cursor:update",data);
  });

  socket.on("cursor:leave",(data)=>
  {
    const roomId=Array.from(socket.rooms)[1];
    socket.to(roomId).emit("cursor:leave",data);
  });

  socket.on("canvas:update",async (data)=>
  {
    const roomId=Array.from(socket.rooms)[1];
    socket.to(roomId).emit("canvas:update",data);
  });

  socket.on("svg:drawing",(data)=>
  {
    const roomId=Array.from(socket.rooms)[1];
    socket.to(roomId).emit("svg:drawing",data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`API running on PORT:${port}`);
});
