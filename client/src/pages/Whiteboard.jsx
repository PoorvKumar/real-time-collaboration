import React, { useState, useRef } from 'react';

const Whiteboard = () => {
  const [drawings, setDrawings] = useState([]);
  const [drawingPath, setDrawingPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [scale, setScale] = useState(1);
  const whiteboardRef = useRef(null);

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    const { left, top, width, height } = whiteboardRef.current.getBoundingClientRect();
    console.log('MouseDown - left:', left, 'top:', top, 'width:', width, 'height:', height);
    const x = (event.clientX - left - translateX) / scale;
    const y = (event.clientY - top - translateY) / scale;
    console.log('MouseDown - x:', x, 'y:', y);
    setDrawingPath([{ x, y }]);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing || !whiteboardRef.current) return;

    const { left, top, width, height } = whiteboardRef.current.getBoundingClientRect();
    console.log('MouseMove - left:', left, 'top:', top, 'width:', width, 'height:', height);
    const x = (event.clientX - left - translateX) / scale;
    const y = (event.clientY - top - translateY) / scale;
    console.log('MouseMove - x:', x, 'y:', y);

    setDrawingPath(prevPath => [...prevPath, { x, y }]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (drawingPath.length > 0) {
      console.log('MouseUp - drawingPath:', drawingPath);
      setDrawings(prevDrawings => [...prevDrawings, drawingPath]);
      setDrawingPath([]);
    }
  };

  const handleWheel = (event) => {
    const newScale = scale * (1 - event.deltaY * 0.01);
    console.log('Wheel - newScale:', newScale);
    setScale(newScale);
  };

  return (
    <div
      ref={whiteboardRef}
      style={{
        overflow: 'auto',
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <svg
        width="10000"
        height="10000"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {drawings.map((path, index) => (
          <path
            key={index}
            fill="none"
            stroke="black"
            strokeWidth="2"
            d={generatePathString(path)}
          />
        ))}
        {isDrawing && (
          <path
            fill="none"
            stroke="black"
            strokeWidth="2"
            d={generatePathString(drawingPath)}
          />
        )}
      </svg>
    </div>
  );
};

const generatePathString = (points) => {
  return points.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
};

export default Whiteboard;
