import React from 'react';
import { getSvgPathFromStroke } from "@/lib/utils";
import getStroke from 'perfect-freehand';

const Path = ({ x, y, points, fill, onPointerDown, stroke }) => {
  return (
    <path 
        className='drop-shadow-md'
        onPointerDown={onPointerDown}
        d={getSvgPathFromStroke(
            getStroke(points,{
                size: 16,
                thinning: 0.5,
                smoothing: 0.5,
                streamline: 0.5,
            })
        )}
        style={{
            transform: `translate(${x}px,${y}px)`
        }}
        x={0}
        y={0}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
    />
  )
}

export default Path;