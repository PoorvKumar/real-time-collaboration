const mongoose=require("mongoose");

const canvasSchema=new mongoose.Schema({
    data: { type: String },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }
});

module.exports=mongoose.model("Canvas",canvasSchema);