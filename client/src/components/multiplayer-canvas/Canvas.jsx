import React, { useEffect, useRef, useState } from 'react';
import { fabric } from "fabric";
import { useSocket } from '@/hooks/useSocket';
import { useAuthenticate } from '@/context/AuthContext';
import Cursor from '../multiplayer-board/Cursor';
import CursorPresence from './CursorPresence';
import { useRoom } from '@/context/RoomContext';
import { useCanvas } from '@/context/CanvasContext';
import { v4 as uuidv4 } from "uuid";
// import { Cursor } from "@/utils/multiplayer-canvas-utils";
import {
  handlePanning,
  handlePanningMove,
  handlePanningUp,
  handleWheelPanning,
  handleZoom,
} from "../../eventHandlers/multiplayer-canvas";

const Canvas = () => {

  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  // const [vpt, setVpt] = useState({ x: 0, y: 0 });
  // const [zoomLvl, setZoomLvl] = useState(1);

  const canvasObjRef=useRef(null);

  const socket = useSocket();
  const { user } = useAuthenticate();
  const { userId, color } = useRoom();

  const { vpt, setVpt, zoomLvl, setZoomLvl, tool, setTool, canvasDataRef, prevTool } = useCanvas();

  console.log(tool,Date.now());

  //define eventHandlers based on tools to attach and detach to canvas
  // when tool changes we use useEffect() hook to attach the event listeners and in the cleanup to detahc event listeners and we can get event listeners from the eventListeners defined
  //this will also make it more scalable for more features

  const drawingHandlers=useRef({
    rectangle: {
      mouseDown: startAddRect,
      mouseMove: startDrawingRect,
      mouseUp: stopDrawing
    },
    line: {
      mouseDown: startAddLine,
      mouseMove: startDrawingLine,
      mouseUp: stopDrawing
    }
  });

  let drawInstance = null;
  let origX;
  let origY;
  let mouseDown = false;

  let options={
    currentMode: '',
    currentColor: '#000000',
    currentWidth: 2,
    fill: false,
    group: {},
  };

  const modes = {
    rectangle: 'rectangle',
    ellipse: 'ellipse',
    line: 'line',
    pencil: 'pencil',
    eraser: 'eraser',
    select: 'select'
  };

  useEffect(() => {

    fabric.Object.prototype.set({
      cornerColor: 'rgb(47,167,212)', 
      cornerStrokeColor: 'rgb(47,167,212)', 
      cornerSize: 10, 
      cornerStyle: 'rect', 
      cornerStrokeWidth: 10, 
      rotatingPointOffset: 10, 
      padding: 6,
      borderDashArray: [5, 5]
    });

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
    canvas.setViewportTransform([zoomLvl, 0, 0, zoomLvl, vpt.x, vpt.y]);

    const emptyCanvas=canvasDataRef.current.objects.length!==0;

    if (!emptyCanvas) {
      canvas.loadFromJSON(canvasDataRef.current, () => {
        canvas.renderAll();
      })
    }

    canvasObjRef.current=canvas;

    // We can attach event listeners in the second useEffect hook itself, so that whenever tool is there or not, the events are attached

    // // Cursor Position Emitting
    // canvas.on("mouse:move", (opt) => {
    //   const pointer = canvas.getPointer(opt.e);

    //   // const vpt = canvas.viewportTransform;
    //   // const zoom = canvas.getZoom();

    //   // setVpt({ x: vpt[4], y: vpt[5] });
    //   // setZoomLvl(zoom);

    //   socket.emit("cursor:update", { userId, position: pointer, name: user.name, color });
    //   // setCursorPosition(pointer);
    // });

    // canvas.on("mouse:out", () => {
    //   socket.emit("cursor:leave", { userId });
    // });

    // // Zoom to Point
    // canvas.on('mouse:wheel', handleZoom(canvas, setZoomLvl, setVpt));

    // // Panning using wheel
    // canvas.on("mouse:wheel", handleWheelPanning(canvas, setVpt));
    // //Panning while holding altKey
    // canvas.on('mouse:down', handlePanning(canvas));
    // canvas.on('mouse:move', handlePanningMove(canvas));
    // canvas.on('mouse:up', handlePanningUp(canvas));

    // canvas.on("mouse:down",handleMouseDown(canvas));
    // canvas.on("mouse:move",handleMouseMove(canvas));
    // canvas.on("mouse:up",handleMouseUp(canvas));

    // canvas.on('object:added', () => updateCanvasData(canvas.toJSON()));
    // canvas.on('object:modified', () => updateCanvasData(canvas.toJSON()));
    // canvas.on('object:removed', () => updateCanvasData(canvas.toJSON()));

    socket.on("canvas:update",(data)=>
    {
      const { type, object }=data;

      switch(type)
      {
        case "object:added":
          console.log(object);
          break;

        case "drawing":
          const drawingObject=new fabric.Object(object);
          // canvas.add(drawingObject);
          console.log(drawingObject);
          break;
      }
    });

    return () => {
      socket.off("canvas:update");
      canvasObjRef.current=null;
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if(canvasObjRef && canvasObjRef.current)
    {
      /* **** Attach/Re-attach Event listeners to canvas object when tool changes **** */
      
      // Cursor Position Emitting
      canvasObjRef.current.on("mouse:move", (opt) => {
        const pointer = canvasObjRef.current.getPointer(opt.e);
        socket.emit("cursor:update", { userId, position: pointer, name: user.name, color });
      });

      canvasObjRef.current.on("mouse:out", () => {
        socket.emit("cursor:leave", { userId });
      });

      // Zoom to Point
      canvasObjRef.current.on('mouse:wheel', handleZoom(canvasObjRef.current, setZoomLvl, setVpt));

      // Panning using wheel
      canvasObjRef.current.on("mouse:wheel", handleWheelPanning(canvasObjRef.current, setVpt));
      //Panning while holding altKey
      canvasObjRef.current.on('mouse:down', handlePanning(canvasObjRef.current));
      canvasObjRef.current.on('mouse:move', handlePanningMove(canvasObjRef.current));
      canvasObjRef.current.on('mouse:up', handlePanningUp(canvasObjRef.current));

      // Saving Canvas Data
      // canvasObjRef.current.on('object:added', () => { console.log("object:added",canvasObjRef.current.toJSON()); updateCanvasData(canvasObjRef.current.toJSON());});
      // canvasObjRef.current.on('object:modified', () => { console.log("object:modified",canvasObjRef.current.toJSON()); updateCanvasData(canvasObjRef.current.toJSON());});
      // canvasObjRef.current.on('object:removed', () => updateCanvasData(canvasObjRef.current.toJSON()));

      // canvasObjRef.current.on('object:added', function(event) {
      //   const addedObject = event.target;
      //   console.log('Object added:', addedObject);
      // });

      if(tool!=='select' && canvasObjRef.current)
      {
        canvasObjRef.current.selection = false;
        canvasObjRef.current.hoverCursor = 'auto';
        canvasObjRef.current.isDrawingMode = false;
        canvasObjRef.current.getObjects().map((item) => item.set({ selectable: false }));
        canvasObjRef.current.discardActiveObject().requestRenderAll();

        //because when tool changes the component will re-render as it is a state variable and also the component subsrcibed to it from canvas context
        //because of this re-render of component, if the tool is select we don't need to do anything as it will be same as default

        const handlers=drawingHandlers.current[tool];

        // remove existing event listeners to avoid duplicate attachment of event listeners
        // canvasObjRef.current.off();

        canvasObjRef.current.on("mouse:down",handlers.mouseDown(canvasObjRef.current));
        canvasObjRef.current.on("mouse:move",handlers.mouseMove(canvasObjRef.current));
        canvasObjRef.current.on("mouse:up",handlers.mouseUp(canvasObjRef.current));

        // canvasObjRef.current.on("mouse:down",startAddRect(canvasObjRef.current));
        // canvasObjRef.current.on("mouse:move",startDrawingRect(canvasObjRef.current));
        // canvasObjRef.current.on("mouse:up",stopDrawing(canvasObjRef.current));

        return ()=>
        {
          // console.log(canvasObjRef, canvasObjRef.current);
          canvasObjRef.current.off();
        }
      }
      else
      {
        canvasObjRef.current.selection = true;
        canvasObjRef.current.hoverCursor = 'move';
        canvasObjRef.current.isDrawingMode = false;
        canvasObjRef.current.getObjects().map((item) => item.set({ selectable: true }));
        canvasObjRef.current.requestRenderAll();
      }
    }
  }, [tool]);

  const handleMouseDown = (canvas) => {
    return (opt)=>
    {
      // console.log("mouse:down",tool);
      // console.log(canvas.getPointer(opt.e));
    }
  };

  const handleMouseMove = (canvas) => {
    return (opt)=>
    {
      // console.log("mouse:move",tool);
      // console.log(canvas.getPointer(opt.e));
    }
  };

  const handleMouseUp = (canvas) => {
    return (opt)=>
    {
      // console.log("mouse:up",tool);
      // console.log(canvas.getPointer(opt.e));
    }
  };

  function stopDrawing(canvas) {
    return function()
    {
      mouseDown = false;
      setTool("select");
    }
  }

  let id=uuidv4();

  /* ==============RECTANGLE============== */
  function startAddRect(canvas) {
    return ({ e }) => {
      mouseDown = true;
  
      const pointer = canvas.getPointer(e);
      origX = pointer.x;
      origY = pointer.y;
  
      drawInstance = new fabric.Rect({
        stroke: options.currentColor,
        strokeWidth: options.currentWidth,
        fill: options.fill ? options.currentColor : 'transparent',
        left: origX,
        top: origY,
        width: 200,
        height: 100,
        selectable: false,
      });

      drawInstance.set({
        id: id
      });

      console.log(drawInstance);

      canvasDataRef.current.objects.push({ ...drawInstance.toJSON() });

      socket.emit("canvas:update",{ type: "object:added", object: drawInstance.toJSON() });
  
      canvas.add(drawInstance);
  
      drawInstance.on('mousedown', (e) => {
        if (options.currentMode === modes.eraser) {
          canvas.remove(e.target);
        }
      });
    };
  }
  
  function startDrawingRect(canvas) {
    return ({ e }) => {
      if (mouseDown) {
        const pointer = canvas.getPointer(e);
  
        if (pointer.x < origX) {
          drawInstance.set('left', pointer.x);
        }
        if (pointer.y < origY) {
          drawInstance.set('top', pointer.y);
        }
        drawInstance.set({
          width: Math.abs(pointer.x - origX),
          height: Math.abs(pointer.y - origY),
        });
        drawInstance.setCoords();
        canvas.renderAll();

        socket.emit("canvas:update",{ type: "drawing", object: drawInstance.toJSON() });
      }
    };
  }

  /* ==============LINE============== */
  function startAddLine(canvas) {
    return ({ e }) => {
      mouseDown = true;
  
      let pointer = canvas.getPointer(e);
      drawInstance = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: options.currentWidth,
        stroke: options.currentColor,
        selectable: false,
      });
  
      canvas.add(drawInstance);
      canvas.requestRenderAll();
    };
  }
  
  function startDrawingLine(canvas) {
    return ({ e }) => {
      if (mouseDown) {
        const pointer = canvas.getPointer(e);
        drawInstance.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        drawInstance.setCoords();
        canvas.requestRenderAll();
      }
    };
  }

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
          {/* <Cursor position={cursorPosition} userId={userId} name={user.name} color={color} /> */}
          <CursorPresence />
        </g>
      </svg>
      <button className='absolute bottom-5 right-24'>btn</button>
    </div>
  )
}

export default Canvas;