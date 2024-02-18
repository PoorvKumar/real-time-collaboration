import React, { useCallback, useState } from "react";

// WebSockets throttling to avoid overwhelming the websockets
export const useThrottledEmit=(socket)=>
{
    return (eventName,data)=>
    {
        socket.emit(eventName,data); //currently throttling set to 0 as not needed, as users grow, could implement load balancers and then include throttling 
    }

    const [throttleTimer,setThrottleTimer]=useState(null);
    const throttleInterval=0; //currently throttling set to 0 as not needed, as users grow, could implement load balancers and then include throttling 

    const throttledEmit=useCallback((eventName,data)=>
    {
        if(!throttleTimer)
        {
            socket.emit(eventName,data);
            setThrottleTimer(setTimeout(()=> //throttleTimer no longer null until the throttleInterval, after which it will call the callback() function to assign it null;
            {
                setThrottleTimer(null);
            },throttleInterval));
        }
    },[socket,throttleTimer]);

    return throttledEmit;
};

