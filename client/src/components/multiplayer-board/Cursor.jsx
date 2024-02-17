import React from 'react'

const Cursor = ({ position }) => {

    if (!position) {
        return null;
    }

    return (
        <circle cx={position.x} cy={position.y} r={5} fill="red" />
    );
};


export default Cursor;