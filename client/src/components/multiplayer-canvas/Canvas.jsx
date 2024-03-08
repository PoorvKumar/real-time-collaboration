import React, { useEffect, useRef } from 'react';
import { fabric } from "fabric";

const Canvas = () => {

  const canvasRef=useRef(null);

  useEffect(()=>
  {
    const canvas=new fabric.Canvas(canvasRef.current,{
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "white"
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
    </div>
  )
}

export default Canvas