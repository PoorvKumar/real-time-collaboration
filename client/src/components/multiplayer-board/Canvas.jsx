import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CanvasMode } from '../../constants';
import GridBackground from './GridBackground';
import { useAuthenticate } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { useRoom } from '@/context/RoomContext';
import CursorPresence from './CursorPresence';
import Cursor from './Cursor';

const Canvas = ({ boardId }) => {

    const { user } = useAuthenticate();
    const { id }=useRoom();
    const socket = useSocket();

    // canvas state
    const [canvasState, setCanvasState] = useState({ mode: CanvasMode.None });
    // viewport 
    const [camera, setCamera] = useState({ x: 0, y: 0 });
    const [zoomLevel, setZoomLevel] = useState(1);

    const [cursorPosition, setCursorPosition] = useState(null);
    const throttleInterval = 1000; // Throttle interval in milliseconds
    let throttleTimer;

    const svgRef = useRef(null);

    const [grid, setGrid] = useState({
        enable: false,
        isSquare: false,
    });

    useEffect(() => {
        const svgElement = svgRef.current;
        if (svgElement) {
            svgElement.addEventListener('wheel', onWheel);
            return () => {
                svgElement.removeEventListener('wheel', onWheel);
            };
        }
    }, []);

    useEffect(() => {
        console.log("camera", camera);
    }, [camera]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            // Calculate adjusted cursor position based on camera position and zoom level
            const adjustedX = (clientX - camera.x) / zoomLevel;
            const adjustedY = (clientY - camera.y) / zoomLevel;
            setCursorPosition({ x: adjustedX, y: adjustedY });

            //throttle emitting cursor position
            throttledEmit();
        };

        const emitCursorPosition = () => {
            // Emit cursor position to the server via WebSocket
            socket.emit('cursorPosition', { id, cursorPosition, name: user.name });
        };

        const throttledEmit = () => {
            if (!throttleTimer) {
                emitCursorPosition();
                throttleTimer = setInterval(() => {
                    emitCursorPosition();
                }, throttleInterval);
            }
        };

        const svgElement = svgRef.current;
        if (svgElement) {
            svgElement.addEventListener('mousemove', handleMouseMove);
            return () => {
                svgElement.removeEventListener('mousemove', handleMouseMove);
                clearInterval(throttleTimer);
            };
        }
    }, [camera, cursorPosition, socket, throttleInterval, zoomLevel]);


    const onWheel = useCallback((e) => {
        // console.log("e", e.deltaX, e.deltaY);

        //zoom
        if (e.ctrlKey) {
            e.preventDefault();

            const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
            setZoomLevel(prevZoomLevel => prevZoomLevel * zoomDelta);
        }
        else {
            //change viewport
            let deltaX = e.deltaX;
            let deltaY = e.deltaY;

            if (e.shiftKey) {
                [deltaX, deltaY] = [deltaY, deltaX];
            }

            setCamera((prevCamera) => ({
                x: prevCamera.x - deltaX,
                y: prevCamera.y - deltaY
            }));
        }

    }, [zoomLevel]);

    const onPointerMove = () => {

    };

    const onPointerLeave = () => {
        socket.emit("cursorLeave",{ id });
        setCursorPosition(null);
    };

    const onPointerDown = () => {

    };

    const onPointerUp = () => {

    };

    return (
        <main className='h-full w-full relative bg-white touch-none'>
            <svg
                ref={svgRef}
                className='h-[100vh] w-[100vw]'
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            >
                <GridBackground grid={grid} camera={camera} zoomLevel={zoomLevel} />

                <g
                    style={{
                        transform: `translate(${camera.x}px,${camera.y}px) scale(${zoomLevel})`
                    }}
                >
                    <circle cx="50" cy="50" r="40" fill="blue" />
                    
                    <CursorPresence />
                    
                    {cursorPosition && 
                    <Cursor
                        key={id}
                        userId={id}
                        name={user.name}
                        position={cursorPosition}
                    />}
                </g>
            </svg>
        </main>
    )
}

export default Canvas;