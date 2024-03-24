const express=require("express");
const router=express.Router();
const { authenticateToken }=require("../middlewares/authMiddleware");
const { getAllRooms, getRoomDetails, createRoom, updateRoom, deleteRoom, joinRoom, leaveRoom, inviteToRoom } = require("../controllers/roomController");

router.get("/",getAllRooms);
router.get("/:id",getRoomDetails);

router.use(authenticateToken);

router.post("/create",createRoom);
router.patch("/:id/update",updateRoom);
router.delete("/:id/delete",deleteRoom);

router.post("/:id/join",joinRoom);
router.post("/:id/leave",leaveRoom);
router.post("/:id/invite",inviteToRoom);

module.exports=router;