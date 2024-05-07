require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const mongoose = require("mongoose");
const morgan=require("morgan");
const helmet=require("helmet");

const errorMiddleware=require("./middlewares/errorMiddleware");

// REDIS
// connectToRedisClient();
// const { createClient } = require("redis");
// const client = createClient({
//   url: process.env.REDIS_URL,
// });
// client.on("connect", () =>
//   console.log(`Redis is connected on port ${process.env.REDIS_PORT}`)
// );
// client.on("error", (err) => {
//   console.error("Error Connecting to Redis Client:", err);
// });

// if (process.env.NODE_ENV !== "test") {
//   (async () => {
//     await client.connect();
//   })();

//   client.set("visits", 0);

//   app.get("/visits", async (req, res) => {
//     try {
//       const currentVisits = await client.get("visits");
//       let visits = parseInt(currentVisits) || 0;
//       visits++;
//       await client.set("visits", visits);
//       res.send("Number of visits is: " + visits);
//     } catch (error) {
//       console.error("Error getting or setting visit count:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   });

//   // Attach redisClient middleware
//   app.use(async (req, res, next) => {
//     try {
//       if (!client) {
//         await client.connect();
//       }
//       req.redisClient = client;
//       next();
//     } catch (err) {
//       console.error("Error connecting to Redis:", err);
//       next(err);
//     }
//   });
// }

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