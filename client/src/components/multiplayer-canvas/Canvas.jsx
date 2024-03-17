import React, { useEffect, useRef, useState } from 'react';
import { fabric } from "fabric";
import { useSocket } from '@/hooks/useSocket';
import { useAuthenticate } from '@/context/AuthContext';
import Cursor from '../multiplayer-board/Cursor';
import CursorPresence from './CursorPresence';
import { useRoom } from '@/context/RoomContext';
import { useCanvas } from '@/context/CanvasContext';
// import { Cursor } from "@/utils/multiplayer-canvas-utils";
import { 
  handlePanning, 
  handlePanningMove, 
  handlePanningUp, 
  handleWheelPanning, 
  handleZoom
  } from "../../eventHandlers/multiplayer-canvas";

const Canvas = () => {

  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [vpt, setVpt] = useState({ x:0, y:0 });
  const [zoomLvl, setZoomLvl] = useState(1);
  // const cursors = {};

  const socket = useSocket();
  const { user } = useAuthenticate();
  const { userId, color } = useRoom();

  const { tool, setTool, canvasData, isDrawing, setIsDrawing } = useCanvas();

  fabric.Object.prototype.set({
    cornerColor: 'rgb(47,167,212)', // Sky blue corner color
    cornerStrokeColor: 'rgb(47,167,212)', // Sky blue corner border color
    cornerSize: 7, // Smaller corner size
    cornerStyle: 'rect', // Use rectangular selection corners
    cornerStrokeWidth: 10, // Border width for corners
    rotatingPointOffset: 10, // Offset for the rotating point,
    padding: 6,
  });

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "white",
    });

    canvas.selectionColor = 'rgba(135, 206, 235, 0.3)';
    canvas.selectionBorderColor = 'skyblue';
    canvas.selectionLineWidth = 2;

    const cursorUrl = 'https://ossrs.net/wiki/images/figma-cursor.png';
    canvas.defaultCursor = `url(" ${cursorUrl} "), auto`;

    // Set viewport and zoomLevel
    canvas.setViewportTransform([zoomLvl,0,0,zoomLvl,vpt.x,vpt.y]);

    if(canvasData)
    {
      canvas.loadFromJSON(canvasData,()=>
      {
        canvas.renderAll();
      })
    }

    // Cursor Position Emitting
    canvas.on("mouse:move", (opt) => {
      const pointer = canvas.getPointer(opt.e);
      
      const vpt=canvas.viewportTransform;
      const zoom=canvas.getZoom();
      
      setVpt({ x: vpt[4], y: vpt[5] });
      setZoomLvl(zoom);

      socket.emit("cursor:update", { userId, position: pointer, name: user.name, color });
      setCursorPosition(pointer);
    });

    canvas.on("mouse:out", () => {
      socket.emit("cursor:leave", { userId });
      setCursorPosition(null);
    });

    // Zoom to Point
    canvas.on('mouse:wheel',handleZoom(canvas,setZoomLvl,setVpt));

    // Panning using wheel
    canvas.on("mouse:wheel",handleWheelPanning(canvas,setVpt));
    //Panning while holding altKey
    canvas.on('mouse:down',handlePanning(canvas));
    canvas.on('mouse:move',handlePanningMove(canvas));
    canvas.on('mouse:up',handlePanningUp(canvas));

    if(isDrawing)
    {

      canvas.on('mouse:dblclick', function(event) {
        // Handle double click event here
        console.log("drawing", isDrawing);
        console.log('Double click at coordinates:', event.e.clientX, event.e.clientY);
      });
      

      canvas.on("mouse:down",(opt)=>
      {

      });

      canvas.on("mouse:move",(opt)=>
      {
        
      });

      canvas.on("mouse:up",(opt)=>
      {

      });
    }

    return () => {
      canvas.dispose();
    };
  }, [ canvasData, tool ]);

  return (
    <div className='relative w-full h-full overflow-hidden'>
      <canvas
        ref={canvasRef}
      />
      <svg ref={svgRef} className="absolute top-0 left-0 h-full w-full pointer-events-none">
        <g 
          style={{
            transform: `translate(${vpt.x}px,${vpt.y}px) scale(${zoomLvl})`
        }}
        >
        <Cursor position={cursorPosition} userId={userId} name={user.name} color={color} />
        <CursorPresence />
        </g>
      </svg>
    </div>
  )
}

export default Canvas;