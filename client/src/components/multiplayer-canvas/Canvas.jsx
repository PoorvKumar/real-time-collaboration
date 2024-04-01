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
import DrawingPreview from './DrawingPreview';
import { FaGithub } from "react-icons/fa";
import { useTheme } from '@/context/ThemeContext';

const Canvas = () => {

  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  // const [vpt, setVpt] = useState({ x: 0, y: 0 });
  // const [zoomLvl, setZoomLvl] = useState(1);

  const canvasObjRef = useRef(null);

  const socket = useSocket();
  const { user } = useAuthenticate();
  const { userId, color } = useRoom();

  const { vpt, setVpt, zoomLvl, setZoomLvl, tool, setTool, canvasData } = useCanvas();

  const drawingPositionsRef = useRef([]);

  const { dark }=useTheme();
  // console.log(dark);

  // console.log(tool,Date.now());

  //define eventHandlers based on tools to attach and detach to canvas
  // when tool changes we use useEffect() hook to attach the event listeners and in the cleanup to detach event listeners and we can get event listeners from the eventListeners defined
  //this will also make it more scalable for more features

  const drawingHandlers = useRef({
    rectangle: {
      mouseDown: startAddRect,
      mouseMove: startDrawingRect,
      mouseUp: stopDrawing
    },
    line: {
      mouseDown: startAddLine,
      mouseMove: startDrawingLine,
      mouseUp: stopDrawing
    },
    circle: {
      mouseDown: startAddEllipse,
      mouseMove: startDrawingEllipse,
      mouseUp: stopDrawing
    },
    text: {
      mouseDown: startAddText,
      mouseMove: () => { },
      mouseUp: stopDrawing
    }
  });

  let drawInstance = null;
  let origX;
  let origY;
  let mouseDown = false;

  let options = {
    currentMode: '',
    currentColor: dark ? '#ffffff' : '#000000',
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
      objectCaching: false,
      cornerColor: 'rgb(47,167,212)',
      cornerStrokeColor: 'rgb(47,167,212)',
      cornerSize: 10,
      cornerStyle: 'rect',
      cornerStrokeWidth: 10,
      rotatingPointOffset: 10,
      padding: 6,
      borderDashArray: [5, 5],
      strokeUniform: true
    });

    fabric.Canvas.prototype.getObjectById = function (id) {
      return this.getObjects().find(obj => obj.id === id);
    };

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: dark? "#1e1e1e":"white",
      freeDrawingBrush: new fabric.PencilBrush(),
    });

    canvas.selectionColor = 'rgba(135, 206, 235, 0.3)';
    canvas.selectionBorderColor = 'skyblue';
    canvas.selectionLineWidth = 2;

    canvas.isPointerDown = false;

    // const cursorUrl = 'https://ossrs.net/wiki/images/figma-cursor.png';
    // canvas.defaultCursor = `url(" ${cursorUrl} "), auto`;

    // Set viewport and zoomLevel
    canvas.setViewportTransform([zoomLvl, 0, 0, zoomLvl, vpt.x, vpt.y]);

    canvas.loadFromJSON(canvasData, () => {
      canvas.renderAll();
    });

    canvasObjRef.current = canvas;

    socket.on("canvas:update", (data) => {
      const { type, object, target } = data;

      console.log(data);

      switch (type) {
        case "object:added":
          fabric.util.enlivenObjects([object], (objects) => {
            objects.forEach((obj) => {
              canvas.add(obj);
            })
          });
          break;

        case "drawing":
          const existingObject = canvas.getObjectById(object.id);

          if (existingObject) {
            existingObject.set(object);
            canvas.renderAll();
          }
          break;

        case "object:modified":
        case "object:moving":
        case "object:rotating":
        case "object:scaling":

          if (target && target.type == "activeSelection") {
            const objects = target.objects;
            const offsetX = target.left;
            const offsetY = target.top;
            objects.forEach(objData => {
              const movedObject = canvas.getObjectById(objData.id);
              if (movedObject) {
                movedObject.set({
                  left: objData.left + offsetX,
                  top: objData.top + offsetY
                });
              }
            });
            canvas.renderAll();
          }
          else {
            const modifiedObject = canvas.getObjectById(object.id);
            if (modifiedObject) {
              modifiedObject.set(object);
              canvas.renderAll();
            }
          }
          break;

        case "selection:created":
          const selectedObjects = target;

          // selectedObjects.forEach(obj=>{
          //   const object=canvas.getObjectById(obj.id);
          //   if(object)
          //   {
          //     canvas.setActiveObject(object);
          //   }
          // });
          break;
      }

      // setCanvasData(canvasObjRef.current.toJSON(['id']));
    });

    return () => {

      // setCanvasData(canvas.toJSON(['id']));

      socket.off("canvas:update");
      canvasObjRef.current = null;
      canvas.dispose();
    };
  }, [socket]);

  useEffect(() => {
    if (canvasObjRef && canvasObjRef.current) {
      /* **** Attach/Re-attach Event listeners to canvas object when tool changes **** */

      canvasObjRef.current.on("mouse:down", (opt) => {
        canvasObjRef.current.isPointerDown = true;
      });

      // Cursor Position Emitting
      canvasObjRef.current.on("mouse:move", (opt) => {
        const pointer = canvasObjRef.current.getPointer(opt.e);
        socket.emit("cursor:update", { userId, position: pointer, name: user.name, color });

        if (canvasObjRef.current.isDrawingMode && canvasObjRef.current.isPointerDown) {
          drawingPositionsRef.current.push(canvasObjRef.current.getPointer(opt.e));
          socket.emit("svg:drawing", { userId, drawings: drawingPositionsRef.current });
        }
      });

      canvasObjRef.current.on("mouse:up", (opt) => {
        canvasObjRef.current.isPointerDown = false;
        drawingPositionsRef.current = [];
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

      // Update Canvas Data
      canvasObjRef.current.on("object:modified", (event) => {
        // const modifiedObj=event.target;
        // socket.emit("canvas:update",{ type: "object:modified", object: modifiedObj.toJSON(['id']) });
        // setCanvasData(canvasObjRef.current.toJSON(['id']));
      });

      canvasObjRef.current.on("object:moving", (event) => {
        const target = event.target;
        if (target.type === "activeSelection") {
          socket.emit("canvas:update", { type: "object:moving", target: target.toJSON(['id']) });
        }
        else {
          socket.emit("canvas:update", { type: "object:moving", object: target.toJSON(['id']) });
        }
      });
      canvasObjRef.current.on("object:scaling", (event) => {
        const target = event.target;
        // console.log("object:moving",target.toJSON(['id']));
        if (target.type === "activeSelection") {
          socket.emit("canvas:update", { type: "object:scaling", target: target.toJSON(['id']) });
        }
        else {
          socket.emit("canvas:update", { type: "object:scaling", object: target.toJSON(['id']), target: target });
        }
      });
      canvasObjRef.current.on("object:rotating", (event) => {
        const target = event.target;
        // console.log("object:moving",target.toJSON(['id']));
        if (target.type === "activeSelection") {
          socket.emit("canvas:update", { type: "object:rotating", target: target.toJSON(['id']) });
        }
        else {
          socket.emit("canvas:update", { type: "object:rotating", object: target.toJSON(['id']), target: target });
        }
      });

      canvasObjRef.current.on("selection:created", (event) => {
        const { selected } = event;
        let selectedObjects = [];
        selected.forEach(obj => {
          selectedObjects.push(obj.toJSON(['id']));
        });
        socket.emit("canvas:update", { type: "selection:created", target: selectedObjects });
      });

      canvasObjRef.current.on("path:created", (event) => {
        const path = event.path;
        path.set({
          id: uuidv4()
        });
        const pathData = path.toObject(['id', 'type', 'left', 'top', 'width', 'height', 'path']);
        socket.emit("canvas:update", { type: "object:added", object: pathData });
      });

      switch (tool) {
        case "pencil":
          canvasObjRef.current.isDrawingMode = true;

          canvasObjRef.current.freeDrawingBrush.width = 1; // Set brush width
          canvasObjRef.current.freeDrawingBrush.color = dark? 'white':'black'; // Set brush color
          canvasObjRef.current.freeDrawingBrush.curveStep = 10;
          canvasObjRef.current.freeDrawingBrush.strokeUniform = true;
          break;
        case "select":
          canvasObjRef.current.selection = true;
          canvasObjRef.current.hoverCursor = 'move';
          canvasObjRef.current.isDrawingMode = false;
          canvasObjRef.current.getObjects().map((item) => item.set({ selectable: true }));
          // canvasObjRef.current.requestRenderAll();
          canvasObjRef.current.hoverCursor = 'all-scroll';
          break;
        default:
          canvasObjRef.current.selection = false;
          canvasObjRef.current.hoverCursor = 'auto';
          canvasObjRef.current.isDrawingMode = false;
          canvasObjRef.current.getObjects().map((item) => item.set({ selectable: false }));
          canvasObjRef.current.discardActiveObject().requestRenderAll();

          //because when tool changes the component will re-render as it is a state variable and also the component subsrcibed to it from canvas context
          //because of this re-render of component, if the tool is select we don't need to do anything as it will be same as default

          const handlers = drawingHandlers.current[tool];

          canvasObjRef.current.on("mouse:down", handlers.mouseDown(canvasObjRef.current));
          canvasObjRef.current.on("mouse:move", handlers.mouseMove(canvasObjRef.current));
          canvasObjRef.current.on("mouse:up", handlers.mouseUp(canvasObjRef.current));

          // canvasObjRef.current.on("mouse:down",startAddRect(canvasObjRef.current));
          // canvasObjRef.current.on("mouse:move",startDrawingRect(canvasObjRef.current));
          // canvasObjRef.current.on("mouse:up",stopDrawing(canvasObjRef.current));

          return () => {
            if (canvasObjRef.current) {
              // setCanvasData(canvasObjRef.current.toJSON(['id']));
              canvasObjRef.current.off();
            }
          }
      }
    }
  }, [tool, socket]);

  const handleMouseDown = (canvas) => {
    return (opt) => {
      // console.log("mouse:down",tool);
      // console.log(canvas.getPointer(opt.e));
    }
  };

  const handleMouseMove = (canvas) => {
    return (opt) => {
      // console.log("mouse:move",tool);
      // console.log(canvas.getPointer(opt.e));
    }
  };

  const handleMouseUp = (canvas) => {
    return (opt) => {
      // console.log("mouse:up",tool);
      // console.log(canvas.getPointer(opt.e));
    }
  };

  function stopDrawing(canvas) {
    return function () {
      mouseDown = false;
      setTool("select");
    }
  }

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
        rx: 10,
        ry: 10
      });

      drawInstance.set({
        id: uuidv4()
      });

      const obj = drawInstance.toJSON(['id']);
      socket.emit("canvas:update", { type: "object:added", object: obj });

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
        // console.log(drawInstance.toJSON(['id']));
        socket.emit("canvas:update", { type: "drawing", object: drawInstance.toJSON(['id']) });
        canvas.renderAll();
      }
    };
  }

  /* ==============ELLIPSE============== */
  function startAddEllipse(canvas) {
    return ({ e }) => {
      mouseDown = true;

      const pointer = canvas.getPointer(e);
      origX = pointer.x;
      origY = pointer.y;
      drawInstance = new fabric.Ellipse({
        stroke: options.currentColor,
        strokeWidth: options.currentWidth,
        fill: options.fill ? options.currentColor : 'transparent',
        left: origX,
        top: origY,
        cornerSize: 7,
        objectCaching: false,
        selectable: false
      });

      drawInstance.set({
        id: uuidv4()
      });

      const obj = drawInstance.toJSON(['id']);
      socket.emit("canvas:update", { type: "object:added", object: obj });

      canvas.add(drawInstance);

      drawInstance.on('mousedown', (e) => {
        if (options.currentMode === modes.eraser) {
          canvas.remove(e.target);
        }
      });
    };
  }

  function startDrawingEllipse(canvas) {
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
          rx: Math.abs(pointer.x - origX) / 2,
          ry: Math.abs(pointer.y - origY) / 2,
        });
        drawInstance.setCoords();
        // console.log(drawInstance.toJSON(['id']));
        socket.emit("canvas:update", { type: "drawing", object: drawInstance.toJSON(['id']) });
        canvas.renderAll();
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

      drawInstance.set({
        id: uuidv4()
      });

      const obj = drawInstance.toJSON(['id']);
      socket.emit("canvas:update", { type: "object:added", object: obj });

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
        // console.log(drawInstance.toJSON(['id']));
        socket.emit("canvas:update", { type: "drawing", object: drawInstance.toJSON(['id']) });
        canvas.renderAll();
      }
    };
  }

  /* ==============PENCIL============== */


  /* ==============TEXT============== */
  function startAddText(canvas) {
    return ({ e }) => {
      const pointer = canvas.getPointer(e);
      origX = pointer.x;
      origY = pointer.y;

      const text = new fabric.Textbox('text', {
        left: origX,
        top: origY,
        fill: options.currentColor,
        editable: true,
        fontSize: 23
      });

      text.set({
        id: uuidv4()
      });

      const obj = text.toJSON(['id']);
      socket.emit("canvas:update", { type: "object:added", object: obj });

      canvas.add(text);
      canvas.renderAll();
    }
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
          {/* <DrawingPreview /> */}
        </g>
      </svg>
      {/* <button className='absolute bottom-4 left-4 text-4xl transform transition-transform hover:scale-110'>
        <FaGithub />
      </button> */}
    </div>
  )
}

export default Canvas;