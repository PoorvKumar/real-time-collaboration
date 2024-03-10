import React, { createContext, useContext, useState } from "react";

const CanvasContext=createContext(null);

export const CanvasProvider=({children})=>
{
    const [tool,setTool]=useState('select');

    return <CanvasContext.Provider value={{ tool, setTool }}>
        {children}
    </CanvasContext.Provider>;
};

export const useCanvas=()=> useContext(CanvasContext);