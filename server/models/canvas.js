const mongoose=require("mongoose");

const canvasSchema=new mongoose.Schema({
    data: { type: String },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }
});

module.exports=mongoose.model("Canvas",canvasSchema);