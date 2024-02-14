const User=require("../models/user");
const bcrypt=require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../utils/jwtUtil");
const { getProfileInfo } = require("../utils/googleoaUTH.JS");

const signup=async (req,res,next)=>
{
    try
    {
        const { name, email, password, roles }=req.body;

        if(!name || !email || !password)
        {
            return res.status(400).json({ msg: "Missing Information"});
        }

        const foundUser=await User.findOne({email});
        if(foundUser)
        {
            return res.status(409).json({ msg: "User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const user=new User({
            name,
            email,
            password: hashedPassword,
            roles
        });

        await user.save();

        return res.status(201).json({msg: "User registered seccessfully!"});
    }
    catch(error)
    {
        next(error);
    }
};

const signin=async (req,res,next)=>
{
    try
    {
        const { email, password }=req.body;

        if(!email || !password)
        {
            return res.status(400).json({ msg: "Email or Password missing"});
        }

        const user=await User.findOne({email});

        if(!user)
        {
            return res.status(404).json({ msg: "User not found" });
        }

        const isValidPassword=await bcrypt.compare(password,user.password);

        if(!isValidPassword)
        {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token=generateToken(user);
        const refreshToken=generateRefreshToken(user);

        user.refreshToken=refreshToken;
        await user.save();

        const userData=Object.assign({},{ name: user.name, email: user.email });

        return res.status(200).json({ token, refreshToken, userData });
    }
    catch(error)
    {
        next(error);
    }
};

const googleLogin=async (req,res,next)=>
{
    try
    {
        const { accessCode }=req.body;

        const profile=getProfileInfo(accessCode);

        const user=new User({
            name: profile.name,
            email: profile.email
        });

        await user.save();

        const token=generateToken(user);
        const refreshToken=generateRefreshToken(user);

        user.refreshToken=refreshToken;
        await user.save();

        const userData=Object.assign({},{ name: user.name, email: user.email });

        return res.status(200).json({ token, refreshToken, userData });
    }
    catch(error)
    {
        next(error);
    }
    
};

module.exports={
    signup,
    signin,
    googleLogin,
};