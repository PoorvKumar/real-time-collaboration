import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from 'nanoid';
import { useAuthenticate } from "./AuthContext";
import { toast } from "react-toastify";

const RoomContext=createContext();

export const RoomProvider=({ children, boardId })=>
{
    const [socket,setSocket]=useState(null);
    const [isConnected,setIsConnected]=useState(false); //loading state
    const [selfPresence,setSelfPresence]=useState({
        cursor: { x:0, y:0 },
        selection: [],
        pencilDraft: null,
        penColor: null
    });
    const [others,setOthers]=useState([]);
    const [othersPresence,setOthersPresence]=useState([]);
    const [layers,setLayers]=useState([]);

    const [userId,setUserId]=useState("");

    const { user }=useAuthenticate();

    useEffect(()=>
    {
        const webSocket=io(import.meta.env.VITE_SERVER_URL);
        setSocket(webSocket);

        webSocket.on("connect",()=>
        {
            console.log("Connected to server",webSocket);
            setIsConnected(true);
            toast.success("Connected to websockets",{
                position: "top-center",
                autoClose: 3000
            });
        });

        webSocket.on("connect_error",()=>
        {
            console.log("Error establishing websocket connection");
            setIsConnected(false);
            toast.warn("Error connecting to websocket",{
                position: "top-center",
                autoClose: 3000
            });
        });

        webSocket.emit("joinRoom",boardId);
        const id=nanoid();
        setUserId(id);

        webSocket.emit("userJoin",{ id, user });
        webSocket.on("userJoin",(data)=>
        {
            console.log("User joined",data);
            setOthers(prev=>[...prev,data]);
        });

        const cleanup = () => {
            webSocket.off("userJoin");
            webSocket.emit("userLeft", { id });
            webSocket.disconnect();
        };    

        return cleanup;
    },[boardId]);

    useEffect(()=>
    {

    },[]);

    const value={
        socket,
        selfPresence,
        setSelfPresence,
        others,
        othersPresence,
        layers
    };

    return <RoomContext.Provider value={value}>
        { isConnected? children : <p className="flex min-h-screen justify-center items-center">Loading...</p> }
    </RoomContext.Provider>;
};

export const useRoom=()=>useContext(RoomContext);