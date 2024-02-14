const jwt=require("jsonwebtoken");

function generateToken(user)
{
    return jwt.sign({ userId: user._id },process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "3d"});
}

const generateRefreshToken=(user)=>
{
    return jwt.sign({ userId: user._id },process.env.REFRESH_TOKEN_SECRET,{ expiresIn: "15d"});
}

module.exports={
    generateToken,
    generateRefreshToken,
}