import React, { createContext, useContext, useState } from "react";

const CanvasContext=createContext(null);

export const CanvasProvider=({children})=>
{
    const [tool,setTool]=useState('select');
    const [isDrawing,setIsDrawing]=useState(false);

    const [canvasData,setCanvasData]=useState({
        "version": "3.6.3",
        "objects": [
          {
            "type": "rect",
            "originX": "left",
            "originY": "top",
            "left": 10,
            "top": 10,
            "width": 100,
            "height": 100,
            "fill": "red",
            "stroke": null,
            "strokeWidth": 1,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": 1,
            "scaleY": 1,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 1,
            "shadow": null,
            "visible": true,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "skewX": 0,
            "skewY": 0,
            "rx": 0,
            "ry": 0
          },
          {
            "type": "circle",
            "originX": "left",
            "originY": "top",
            "left": 150,
            "top": 150,
            "width": 100,
            "height": 100,
            "fill": "blue",
            "stroke": null,
            "strokeWidth": 1,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeLineJoin": "miter",
            "strokeMiterLimit": 4,
            "scaleX": 1,
            "scaleY": 1,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 1,
            "shadow": null,
            "visible": true,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "radius": 50
          }
        ],
        "background": ""
      }
      );

    return <CanvasContext.Provider value={{ tool, setTool, canvasData, isDrawing, setIsDrawing }}>
        {children}
    </CanvasContext.Provider>;
};

export const useCanvas=()=> useContext(CanvasContext);