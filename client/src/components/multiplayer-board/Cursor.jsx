import React from 'react'

const Cursor = ({ position, camera }) => {
    // Calculate adjusted cursor position based on camera position
    const adjustedX = position.x - camera.x;
    const adjustedY = position.y - camera.y;

    return (
        <circle cx={adjustedX} cy={adjustedY} r={5} fill="red" />
    );
};


export default Cursor;