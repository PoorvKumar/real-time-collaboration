import React, { useRef, useState } from 'react';

const Whiteboard = () => {
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [path, setPath] = useState('');
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const colors = {
    pen: 'black',
    eraser: 'white'
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    setDrawing(true);
    setStartPoint({ x: clientX - translate.x, y: clientY - translate.y });
    setPath(`M ${clientX - translate.x} ${clientY - translate.y}`);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
    const { clientX, clientY } = event;
    setPath((prevPath) => `${prevPath} L ${clientX - translate.x} ${clientY - translate.y}`);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const clearDrawing = () => {
    setPath('');
  };

  const switchTool = (selectedTool) => {
    setTool(selectedTool);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const { deltaX, deltaY } = event;
    setTranslate((prevTranslate) => ({
      x: prevTranslate.x - deltaX,
      y: prevTranslate.y - deltaY
    }));
  };

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center overflow-hidden"
      onWheel={handleWheel}
    >
      <div className="absolute w-full h-full" style={{ transform: `translate(${translate.x}px, ${translate.y}px)` }}>
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ overflow: 'visible' }}
        >
          {/* Dotted grid background */}
          <defs>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${translate.x % 100},${translate.y % 100})`}
            >
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d={path} fill="none" stroke={colors[tool]} strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 flex space-x-4">
        <button onClick={() => switchTool('pen')} className="px-4 py-2 bg-blue-500 text-white rounded">
          Pen
        </button>
        <button onClick={() => switchTool('eraser')} className="px-4 py-2 bg-red-500 text-white rounded">
          Eraser
        </button>
        <button onClick={clearDrawing} className="px-4 py-2 bg-gray-500 text-white rounded">
          Clear
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
