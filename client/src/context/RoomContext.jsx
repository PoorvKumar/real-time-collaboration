import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from 'nanoid';
import { useAuthenticate } from "./AuthContext";
import { toast } from "react-toastify";
import stc from 'string-to-color';

const RoomContext=createContext();

export const RoomProvider=({ children, workspaceId })=>
{
    const [socket,setSocket]=useState(null);
    const [isConnected,setIsConnected]=useState(false);
    
    const [userId,setUserId]=useState("");
    const [color,setColor]=useState("red");

    const { user }=useAuthenticate();

    useEffect(()=>
    {
        const webSocket=io(import.meta.env.VITE_SERVER_URL);
        setSocket(webSocket);

        webSocket.on("connect",()=>
        {
            setIsConnected(true);
            toast.success("Connection Established",{
                position: "bottom-left",
                autoClose: 3000,
                theme: "dark"
            });
        });

        webSocket.on("connect_error",()=>
        {
            setIsConnected(false);
            toast.warn("Error connecting to websocket",{
                position: "bottom-left",
                autoClose: 3000,
                theme: "dark"
            });
        });

        webSocket.emit("room:join",workspaceId);
        const id=nanoid();
        setUserId(id);
        setColor(stc(id));

        webSocket.emit("user:join",{ userId: id, user });
        webSocket.on("user:join",(data)=>
        {
            console.log("User joined: ",data);
        });

        const cleanup = () => {
            webSocket.off("join:user");
            webSocket.emit("cursor:leave",{ userId: id });
            webSocket.emit("user:left", { userId: id });
            webSocket.disconnect();
        };    

        return cleanup;
    },[workspaceId]);

    const value={
        socket,
        userId,
        color,
    };

    return <RoomContext.Provider value={value}>
        { isConnected? children : <p className="flex min-h-screen justify-center items-center">Loading...</p> }
    </RoomContext.Provider>;
};

export const useRoom=()=>useContext(RoomContext);