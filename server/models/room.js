const mongoose=require("mongoose");

const roomSchema=new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    tags: [{ type: String }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    privacy: { type: String, enum: [ "public", "private" ] },
    canvas: { type: mongoose.Schema.Types.ObjectId, ref: "Canvas" },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: "Editor" },
    createdAt: { type: Date, default: Date.now() }
});

module.exports=mongoose.model("Room",roomSchema);