import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSocket } from '@/hooks/useSocket';

const calculateFontSize = (width, height) => {
    const maxFontSize = 96;
    const scaleFactor = 0.5;
    const fontSizeBasedOnHeight = height * scaleFactor;
    const fontSizeBasedOnWidth = width * scaleFactor;

    return Math.min(
        fontSizeBasedOnHeight,
        fontSizeBasedOnWidth,
        maxFontSize
    );
};

const Text = ({ id, x, y, value, width, height }) => {

    const socket=useSocket();

    const textRef=useRef(null);

    const [textVal,setTextVal]=useState("text");

    const handleContentChange=(e)=>
    {
        setTextVal(e.target.value);

        socket.emit("textChange",{ id, text: e.target.value });
    }

  return (
    <foreignObject
        x={x}
        y={y}
        width={50*textVal.length+24}
        height={80}
        stroke='#000'
    >
        <ContentEditable 
            innerRef={textRef} 
            html={ textVal }
            onChange={handleContentChange}
            className='h-full w-full bg-red flex items-center justify-center text-center drop-shadow-md outline-none'
            style={{
                fontSize: 72
            }}
        />
    </foreignObject>
  )
}

export default Text