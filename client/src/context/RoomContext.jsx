import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from 'nanoid';
import { useAuthenticate } from "./AuthContext";
import { toast } from "react-toastify";
import { CanvasMode } from "../constants";

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

    const [undoStack,setUndoStack]=useState([]);
    const [redoStack,setRedoStack]=useState([]);

    const addLayer=(newLayer)=>
    {
        setLayers((prev)=>[ ...prev, newLayer ]);
        setUndoStack((prev)=>[ ...prev, layers ]);
        setRedoStack([]);
    };

    //Function to undo an action
    const undo=()=>
    {
        if(undoStack.length===0)
        {
            return ;
        }
        const prevState=undoStack.pop();
        setLayers(prevState);
        setRedoStack((prevStack)=>[ ...prevStack, layers ]);
    }

    //Function to redo an action
    const redo=()=>
    {
        if(redoStack.length===0)
        {
            return ;
        }
        const nextStack=redoStack.pop();
        setLayers(nextStack);
        setUndoStack((prevStack)=>[ ...prevStack, layers ]);
    };

    const [canvasState, setCanvasState] = useState({ mode: CanvasMode.None });

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
        if(!socket)
        {
            return ;
        }

        socket.on("newLayer",(data)=>
        {
            addLayer(data);
        });

        return ()=>
        {
            socket.off("newLayer");
        };
    },[socket,boardId]);

    const value={
        socket,
        id: userId,
        selfPresence,
        setSelfPresence,
        others,
        othersPresence,
        layers,
        addLayer,
        canvasState,
        setCanvasState,
        undo,
        redo,
        canUndo: undoStack.length>0,
        canRedo: redoStack.length>0
    };

    return <RoomContext.Provider value={value}>
        { isConnected? children : <p className="flex min-h-screen justify-center items-center">Loading...</p> }
    </RoomContext.Provider>;
};

export const useRoom=()=>useContext(RoomContext);