require("dotenv").config();

const express=require("express");
const app=express();

const http=require("http");
const { Server }=require("socket.io");
const cors=require("cors");

const { CLIENT_URL }=require("./config/config");

const server=http.createServer(app);
const io=new Server(server,{
    cors: {
        origin: CLIENT_URL
    }
});

io.on("connection",(socket)=>
{
    console.log("User connected",socket.id);

    socket.on("disconnect",()=>
    {
        console.log("User disconnected",socket.id);
    });
});

app.get('/',(req,res)=>
{
    return res.json({ msg: "Server running!" });
});

const port=process.env.PORT || 5000;
server.listen(port,()=>
{
    console.log(`API running on PORT:${port}`);
});