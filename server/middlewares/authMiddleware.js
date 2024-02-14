const jwt=require("jsonwetoken");
const User=require("../models/user");

function authenticateToken(req,res,next)
{
    const authHeader=req.headers.Authorization || req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.sendStatus(401);
    }

    const token=authHeader.split(" ")[1];

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,decoded)=>
    {
        if(err)
        {
            return res.status(430).json({ error: "Unauthorized! Invalid token" });
        }

        const userId=decoded.userId;
        const user=await User.findById(userId);

        req.user=user;
        next();
    });
}

const authorizeRoles=(roles)=>
{
    return (req,res,next)=>
    {
        if(!req.user || !req.user.roles || !roles.some((role)=> req.user.roles.includes(role)))
        {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        next();
    }
}

module.exports={
    authenticateToken,
    authorizeRoles
};