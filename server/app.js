require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const { allowedOrigins } = require("./config/config");
const { redisClient , connectToRedisClient }=require("./config/redisClient");
const morgan=require("morgan");
const helmet=require("helmet");

const errorMiddleware=require("./middlewares/errorMiddleware");

// REDIS
// connectToRedisClient();

// Routers
const authRouter=require("./routers/authRouter");
const userRouter=require("./routers/userRouter");
const teamRouter=require("./routers/teamRouter");
const roomRouter=require("./routers/roomRouter");

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

app.use(morgan("dev"));
app.use(helmet());

// app.use((req,res,next)=>
// {
//   req.redisClient=redisClient;
//   next();
// });

app.get("/", (req, res) => {
  return res.json({ msg: "Server running!" });
});

app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/teams",teamRouter);
app.use("/api/rooms",roomRouter);

app.use((req,res,next)=>
{
  return res.status(404).json({ msg: "Route not found" });
});

app.use(errorMiddleware);

module.exports=app;