import React, { useEffect, useRef, useState } from 'react';
import { fabric } from "fabric";
import { useSocket } from '@/hooks/useSocket';
import { useAuthenticate } from '@/context/AuthContext';
import Cursor from '../multiplayer-board/Cursor';
import CursorPresence from './CursorPresence';
import { useRoom } from '@/context/RoomContext';
import { useCanvas } from '@/context/CanvasContext';
// import { Cursor } from "@/utils/multiplayer-canvas-utils";

const Canvas = () => {

  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [vpt, setVpt] = useState({ x:0, y:0 });
  const [zoomLvl, setZoomLvl] = useState(1);
  const cursors = {};

  const socket = useSocket();
  const { user } = useAuthenticate();
  const { userId, color } = useRoom();

  const { tool, setTool } = useCanvas();

  // const updateCursorPositions = (e) => {
  //   const { clientX, clientY } = e;

  //   const adjustedX = (clientX - vpt[4]) / zoomLvl;
  //   const adjustedY = (clientY - vpt[5]) / zoomLvl;

  //   socket.emit("cursor:update", { userId, position: { x: adjustedX, y: adjustedY }, name: user.name, color });
  // }

  // useEffect(() => {
  //   const svgElement = svgRef.current;
  //   if (svgElement) {
  //     svgElement.addEventListener('mousemove', updateCursorPositions);
  //     return () => {
  //       svgElement.removeEventListener('mousemove', updateCursorPositions);
  //     };
  //   }
  // }, []);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "white"
    });
    const svgElem = svgRef.current;

    const cursorUrl = 'https://ossrs.net/wiki/images/figma-cursor.png';
    canvas.defaultCursor = `url(" ${cursorUrl} "), auto`;

    canvas.on("mouse:move", (opt) => {
      const pointer = canvas.getPointer(opt.e); //relative
      // const { x, y }=opt.absolutePointer; //absolute

      // console.log(opt);
      
      // console.log("Relative",pointer);
      // console.log("Absolute",{ x, y });
      
      const vpt=canvas.viewportTransform;
      const zoom=canvas.getZoom();

      setVpt({ x: vpt[4], y: vpt[5] });
      setZoomLvl(zoom);

      // console.log("Zoom",zoom);

      // const adjustedX=(x-vpt[4])/zoom;
      // const adjustedY=(y-vpt[5])/zoom;

      socket.emit("cursor:update", { userId, position: pointer, name: user.name, color });
      setCursorPosition(pointer);
    });

    canvas.on("mouse:out", () => {
      socket.emit("cursor:leave", { userId });
      setCursorPosition(null);
    });

    canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.175) zoom = 0.175;

      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    let drawingObject = null;

    canvas.on('mouse:down', function (opt) {
      const pointer = canvas.getPointer(opt.e);

      switch (tool) {
        case 'rectangle':
          drawingObject = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: 'black',
          });
          canvas.add(drawingObject);
          break;
        case 'circle':
          drawingObject = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 0,
            fill: 'transparent',
            stroke: 'black'
          });
          canvas.add(drawingObject);
          break;
        // Add cases for other tools (e.g., arrow, line, pencil, text) here
      }
    });

    canvas.on('mouse:move', function (opt) {
      if (!drawingObject) return;

      const pointer = canvas.getPointer(opt.e);

      switch (tool) {
        case 'rectangle':
          drawingObject.set({ width: pointer.x - drawingObject.left, height: pointer.y - drawingObject.top });
          break;
        case 'circle':
          const radius = Math.abs(pointer.x - drawingObject.left);
          drawingObject.set({ radius });
          break;
        // Add cases for other tools (e.g., arrow, line, pencil, text) here
      }

      canvas.renderAll();
    });

    canvas.on('mouse:up', function (opt) {
      drawingObject = null;
    });

    return () => {
      canvas.dispose();
    };
  }, [tool]);

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