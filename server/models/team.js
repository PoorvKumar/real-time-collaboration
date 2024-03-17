const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const TeamSchema=new Schema({
    name: { type: String, require: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
    createdAt: { type: Date, default: Date.now() }
});

module.exports=mongoose.model("Team",TeamSchema);