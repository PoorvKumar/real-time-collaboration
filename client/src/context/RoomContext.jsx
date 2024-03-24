import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from 'nanoid';
import { useAuthenticate } from "./AuthContext";
import { toast } from "react-toastify";
import stc from 'string-to-color';

const RoomContext = createContext();

export const RoomProvider = ({ children, roomId }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [users, setUsers] = useState({});

    const { user } = useAuthenticate();
    const userId=user.id;
    const color=stc(userId+Date.now());

    useEffect(() => {
        const webSocket = io(import.meta.env.VITE_SERVER_URL);
        setSocket(webSocket);

        webSocket.on("connect", () => {
            setIsConnected(true);
            toast.success("Connection Established", {
                position: "bottom-left",
                autoClose: 3000,
                theme: "dark"
            });
        });

        webSocket.on("connect_error", () => {
            setIsConnected(false);
            toast.error("Error connecting to websocket", {
                position: "bottom-left",
                autoClose: 3000,
                theme: "dark"
            });
        });

        webSocket.emit("room:join", { roomId: roomId, user: user });

        webSocket.on("user:join", (data) => {
            console.log("User joined: ",{ ...data.user, color: data.color });
        });

        webSocket.on("room:users",(data)=>
        {
            console.log(data);
            setUsers(data);
        });

        // webSocket.on("user:left", (data) => {
        //     setUsers(prev => {
        //         const updatedUsers = { ...prev };
        //         delete updatedUsers[data.userId];

        //         return updatedUsers;
        //     });
        // });

        webSocket.on("disconnect",()=>
        {
            setIsConnected(false);
            toast.warn("Try Again", {
                position: "bottom-left",
                autoClose: 3000,
                theme: "dark"
            });
        });

        window.addEventListener("beforeunload", handleBeforeUnload);

        const cleanup = () => {
            webSocket.emit("cursor:leave", { userId: user.id });
            webSocket.emit("user:left", { roomId, userId: user.id });
            webSocket.off("connect");
            webSocket.off("connect_error");
            webSocket.off("room:users");
            webSocket.off("user:join");
            webSocket.disconnect();
        };

        return ()=>
        {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            cleanup();
        };
    }, []);

    const handleBeforeUnload = (event) => {
        // Emit user:left event before the window is unloaded
        if (socket) {
            socket.emit("user:left", { roomId, userId: user.id });
        }
        // Customize confirmation message if needed
        const confirmationMessage = "Are you sure you want to leave?";
        event.returnValue = confirmationMessage; // For Chrome
        return confirmationMessage; // For other browsers
    };    

    const value = {
        socket,
        userId,
        color,
        users
    };

    return <RoomContext.Provider value={value}>
        {isConnected ? children : <p className="flex min-h-screen justify-center items-center">Loading...</p>}
    </RoomContext.Provider>;
};

export const useRoom = () => useContext(RoomContext);