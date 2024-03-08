import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

const Test = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('rectangle'); // Current selected drawing tool
  const [objectIdCounter, setObjectIdCounter] = useState(1); // Counter for generating unique object IDs

  let isDrawing = false;
  let startX, startY, currentX, currentY;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 'white',
    });

    const svg = canvas.toSVG();
    console.log(svg);
    const json = canvas.toJSON();
    console.log(json);

    canvas.on('mouse:down', function (opt) {
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      } else {
        if (tool === 'rectangle' || tool === 'circle') {
          isDrawing = true;
          const pointer = canvas.getPointer(evt);
          startX = pointer.x;
          startY = pointer.y;
          currentX = startX;
          currentY = startY;
        }
      }
    });

    canvas.on('mouse:move', function (opt) {
      if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      } else if (!isDrawing) return;
      const pointer = canvas.getPointer(opt.e);
      currentX = pointer.x;
      currentY = pointer.y;
      canvas.renderAll();
    });

    canvas.on('mouse:up', function (opt) {
      if (this.isDragging) {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
        return;
      }
      if (tool === 'rectangle') {
        isDrawing = false;
        const rect = new fabric.Rect({
          left: startX < currentX ? startX : currentX,
          top: startY < currentY ? startY : currentY,
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
          fill: 'blue',
          rx: 10, // Border radius
          strokeWidth: 2, // Border width
          stroke: 'red', // Border color
          id: `rectangle_${objectIdCounter}`, // Assigning a unique ID to the rectangle
        });
        setObjectIdCounter(objectIdCounter + 1); // Increment the object ID counter
        canvas.add(rect);
        canvas.renderAll();

        // Log the object ID
        console.log('Added rectangle with ID:', rect.id);
      } else if (tool === 'circle') {
        isDrawing = false;
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        const circle = new fabric.Circle({
          left: startX - radius,
          top: startY - radius,
          radius: radius,
          fill: 'blue',
          id: `circle_${objectIdCounter}`, // Assigning a unique ID to the circle
        });
        setObjectIdCounter(objectIdCounter + 1); // Increment the object ID counter
        canvas.add(circle);
        canvas.renderAll();

        // Log the object ID
        console.log('Added circle with ID:', circle.id);
      }
    });

    canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.setZoom(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    canvas.on('object:modified', function (opt) {
      // Log the modified object ID
      console.log('Object modified with ID:', opt.target.id);
    });

    canvas.on('object:moving', function (opt) {
      // Log the moving object ID
      console.log('Object moving with ID:', opt.target.id);
    });

    canvas.on('object:scaling', function (opt) {
      // Log the scaling object ID
      console.log('Object scaling with ID:', opt.target.id);
    });

    canvas.on('object:rotating', function (opt) {
      // Log the rotating object ID
      console.log('Object rotating with ID:', opt.target.id);
    });

    return () => {
      canvas.dispose();
    };
  }, [tool]); // Re-run effect when the selected tool changes

  const selectTool = (selectedTool) => {
    setTool(selectedTool);
  };

  const selectSelectionTool = () => {
    
    setTool('selection');
  };

  return (
    <div className="relative w-screen h-screen bg-gray-100">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      <div className="absolute top-0 left-0 w-full p-4 bg-gray-200">
        <button
          className={`mr-4 p-2 ${tool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => selectTool('rectangle')}
        >
          Rectangle
        </button>
        <button
          className={`mr-4 p-2 ${tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => selectTool('circle')}
        >
          Circle
        </button>
        <button
          className={`p-2 ${tool === 'selection' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={selectSelectionTool}
        >
          Selection
        </button>
      </div>
    </div>
  );
};

export default Test;
