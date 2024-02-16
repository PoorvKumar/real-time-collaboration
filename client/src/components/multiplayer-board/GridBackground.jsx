import React from 'react';

const GridBackground = ({ grid, camera, zoomLevel }) => {
    return (
        <>
            {/* Grid pattern */}
            {grid.isSquare ? (
                <defs>
                    <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse" x={camera.x % 10} y={camera.y % 10} scale={zoomLevel}>
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="0.1" />
                    </pattern>
                </defs> ) : (
                <defs>
                    <pattern
                        id="grid"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                        x={camera.x % 10}
                        y={camera.y % 10}
                        scale={zoomLevel}
                    >
                        <circle cx="5" cy="5" r="1" fill="lightgray" />
                    </pattern>
                </defs> )}

            {/* Grid background */}
            {grid.enable && <rect width="100%" height="100%" fill="url(#grid)" />}
        </>
    )
}

export default GridBackground;