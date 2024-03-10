import React, { memo } from 'react';
import { MousePointer2 } from 'lucide-react';

const Cursor = memo(({ position, name, color }) => {

    if (!position) {
        return null;
    }

    return (
        <foreignObject 
            style={{
                transform: `translate(${position.x}px,${position.y}px)`
            }}
            height={50}
            width={name.length*10+24}
            className='relative drop-shadow-md'
        >
            <MousePointer2 
                className="h-5 w-5"
                style={{
                    fill: color,
                    color: color
                }} 
            />
            <div 
                className='absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold'
                style={{ backgroundColor: color }}
            >
                { name }
            </div>
        </foreignObject>
    );
});


export default Cursor;