const mongoose=require("mongoose");

const workspaceScehma=new mongoose.Schema({
    name: { type: String, require: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", require: true },
});

module.exports=mongoose.model("Workspace",workspaceScehma);