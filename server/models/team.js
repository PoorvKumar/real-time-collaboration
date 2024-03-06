const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const TeamSchema=new Schema({
    name: { type: String, require: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    createdAt: { type: Date, default: Date.now() }
});

module.exports=mongoose.model("Team",TeamSchema);