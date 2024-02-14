const allowedOrigins=require("./config");

const corsOptions={
    origin: (origin,callback)=>
    {
        if(allowedOrigins.indexOf(origin)!==-1 || !origin)
        {
            callback(null,true);
        }
        else
        {
            callback(new Error("Not Allowed by CORS"));
        }
    },
    optionSuccessStatus: 200
};

module.exports=corsOptions;