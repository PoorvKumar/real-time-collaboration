const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    name:
    {
        type: String,
        require: true,
        trim: true
    },
    email: 
    {
        type: String,
        require: true,
        unique: true
    },
    password: 
    {
        type: String,
    },
    roles:
    [{
        type: String,
        enum: ["dev","guest"],
        default: ["user"]
    }],
    refreshToken:
    {
        type: String
    }
},
{
    timestamps: true
});

const User=mongoose.model("user",UserSchema);
module.exports=User;