const mongoose=require("mongoose");

const editorSchema=new mongoose.Schema({
    content: { type: String },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room"}
});

module.exports=mongoose.model("Editor",editorSchema);