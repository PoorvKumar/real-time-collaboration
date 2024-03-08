import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

const Test = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('rectangle'); // Current selected drawing tool

  let isDrawing = false;
  let startX, startY, currentX, currentY;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 'white',
    });

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
        });
        canvas.add(rect);
        canvas.renderAll();
      } else if (tool === 'circle') {
        isDrawing = false;
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        const circle = new fabric.Circle({
          left: startX - radius,
          top: startY - radius,
          radius: radius,
          fill: 'blue',
        });
        canvas.add(circle);
        canvas.renderAll();
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
