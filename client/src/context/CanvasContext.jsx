import React, { createContext, useContext, useRef, useState } from "react";

const CanvasContext = createContext(null);

export const CanvasProvider = ({ children }) => {
  const [tool, setTool] = useState('select');
  const [prevTool, setPrevTool] = useState('select');
  const [activeTab, setActiveTab] = useState("both");

  const [vpt, setVpt] = useState({ x: 0, y: 0 });
  const [zoomLvl, setZoomLvl] = useState(1);

  const canvasDataRef=useRef({
    background: "white",
    objects: []
  });
  // const [canvasData, setCanvasData] = useState(null);
  // const updateCanvasData = (newData) => {
  //   setCanvasData(newData);
  // };

  return <CanvasContext.Provider value={{ vpt, setVpt, zoomLvl, setZoomLvl, tool, setTool, canvasDataRef, activeTab, setActiveTab, prevTool, setPrevTool }}>
    {children}
  </CanvasContext.Provider>;
};

export const useCanvas = () => useContext(CanvasContext);