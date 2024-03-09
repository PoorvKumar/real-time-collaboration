import React, { useEffect, useRef, useState } from 'react';
import { fabric } from "fabric";
import { drawCursor } from '@/utils/multiplayer-canvas-utils';
import Cursor from '../multiplayer-board/Cursor';
import { useSocket } from '@/hooks/useSocket';
import { useAuthenticate } from '@/context/AuthContext';
import CursorPresence from './CursorPresence';
import { useRoom } from '@/context/RoomContext';

const Canvas = () => {

  const canvasRef=useRef(null);
  const svgRef=useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const socket=useSocket();
  const { user }=useAuthenticate();

  useEffect(()=>
  {
    const canvas=new fabric.Canvas(canvasRef.current,{
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "white"
    });

    canvas.on("mouse:move",(opt)=>
    {
      const pointer = canvas.getPointer(opt.e);
      socket.emit("cursor:update", { pointer });
      setCursorPosition({ x: pointer.x, y: pointer.y });
    });

    socket.on("cursor:update",(data)=>
    {

    });

    return ()=>
    {
      canvas.dispose();
    };
  },[]);

  return (
    <div className='relative w-screen h-screen overflow-hidden'>
      <canvas 
        ref={canvasRef} 
      />
      <svg ref={svgRef} className="absolute top-0 left-0 h-full w-full pointer-events-none">
        {/* SVG elements for displaying user cursors */}
        <Cursor position={cursorPosition} userId={123} name={"abc"}/>
      </svg>
    </div>
  )
}

export default Canvas;