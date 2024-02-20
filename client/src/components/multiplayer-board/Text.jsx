import React, { useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSocket } from '@/hooks/useSocket';

const Text = ({ id, x, y, value, fontSize }) => {

    // const socket=useSocket();
    const textRef=useRef(null);

    const [textVal,setTextVal]=useState("text");

    const width = fontSize * textVal.length + 24;
    const height = fontSize * 2;

    const handleContentChange=(e)=>
    {
        setTextVal(e.target.value);

        // socket.emit("textChange",{ id, text: e.target.value });
    }

  return (
    <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        stroke='#000'
    >
        <ContentEditable 
            innerRef={textRef} 
            html={ textVal }
            onChange={handleContentChange}
            className='h-full w-full bg-red flex items-center justify-start text-start drop-shadow-md outline-none'
            style={{
                fontSize: fontSize
            }}
        />
    </foreignObject>
  )
}

export default Text