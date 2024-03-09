import React, { createContext, useContext, useState } from "react";

const CanvasContext=createContext(null);

export const CanvasProvider=({children})=>
{

    return <CanvasContext.Provider value={{  }}>
        {children}
    </CanvasContext.Provider>;
};

export const useCanvas=()=> useContext(CanvasContext);