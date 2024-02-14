const errorMiddleware=(err,req,res,next)=>
{
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
}

module.exports=errorMiddleware;