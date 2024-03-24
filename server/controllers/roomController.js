const Room=require("../models/room");

const getAllRooms=async (req,res,next)=>
{
    try
    {
        const rooms=await Room.find();
        return res.status(200).json(rooms);
    }
    catch(err)
    {
        next(err);
    }
};

const getRoomDetails= async (req,res,next)=>
{
    try
    {
        const { id }=req.params;
        const room=await Room.findById(id);

        if(!room)
        {
            return res.status(404).json({ msg: "Room not found" });
        }

        return res.status(200).json(room);
    }
    catch(err)
    {
        next(err);
    }
};

const createRoom= async (req,res,next)=>
{
    try
    {
        console.log(req.user);
        const { name, description, tags, privacy }=req.body;
        const room=new Room({
            name, 
            description, 
            creator: req.user._id,
            tags,
            privacy,
            participants: [ req.user._id ]
        });

        await room.save();
        return res.status(201).json(room);
    }
    catch(err)
    {
        next(err);
    }
};

const updateRoom= async (req,res,next)=>
{
    try
    {
        const { id }=req.params;
        const { name, description, tags, privacy }=req.body;

        const updatedRoom = await Room.findByIdAndUpdate(
          id,
          { name, description, tags, privacy },
          { new: true }
        );

        if(!updatedRoom)
        {
            return res.status(404).json({ msg: "Room not found" });
        }

        return res.status(200).json(updatedRoom);
    }
    catch(err)
    {
        next(err);
    }
};

const deleteRoom= async (req,res,next)=>
{

    try
    {
        const { id }=req.params;
        const deletedRoom=await Room.findByIdAndDelete(id);

        if(!deleteRoom)
        {
            return res.status(404).json({ msg: "Room not found" });
        }

        return res.status(204).end();
    }
    catch(err)
    {
        next(err);
    }
};

const joinRoom= async (req,res,next)=>
{
    try
    {
        global.io.to("room_1").emit("join:room",{ msg: "this is from inside controller" });
    }
    catch(err)
    {
        next(err);
    }
};

const leaveRoom= async (req,res,next)=>
{
    try
    {

    }
    catch(err)
    {
        next(err);
    }
};

const inviteToRoom= async (req,res,next)=>
{
    try
    {

    }
    catch(err)
    {
        next(err);
    }
};

module.exports={
    getAllRooms,
    getRoomDetails,
    createRoom,
    updateRoom,
    deleteRoom,
    joinRoom,
    leaveRoom,
    inviteToRoom
};