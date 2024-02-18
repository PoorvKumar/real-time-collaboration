import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CanvasMode, LayerType } from '../../constants';
import GridBackground from './GridBackground';
import { useAuthenticate } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { useRoom } from '@/context/RoomContext';
import CursorPresence from './CursorPresence';
import Cursor from './Cursor';
import Toolbar from './Toolbar';
import Path from './Path';
import LayerPreview from './LayerPreview';
import { useThrottledEmit } from '@/hooks/useThrottledEmit';
import { nanoid } from 'nanoid';

const Canvas = ({ boardId }) => {

    const { user } = useAuthenticate();
    const { id, layers, addLayer } = useRoom();
    const socket = useSocket();

    // canvas state
    // const [canvasState, setCanvasState] = useState({ mode: CanvasMode.None });
    const { canvasState, setCanvasState } = useRoom();
    // viewport 
    const [camera, setCamera] = useState({ x: 0, y: 0 });
    const [zoomLevel, setZoomLevel] = useState(1);

    const [cursorPosition, setCursorPosition] = useState(null);
    const throttledEmit=useThrottledEmit(socket);
    
    const [grid, setGrid] = useState({
        enable: false,
        isSquare: false,
    });

    // Pencil Drawing
    const [pencilDraft,setPencilDraft]=useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const svgRef = useRef(null);

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
        console.log("canvasState", canvasState);
    }, [camera, canvasState]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            // Calculate adjusted cursor position based on camera position and zoom level
            const adjustedX = (clientX - camera.x) / zoomLevel;
            const adjustedY = (clientY - camera.y) / zoomLevel;
            setCursorPosition({ x: adjustedX, y: adjustedY });

            // throttledEmit('cursorPosition',{ id, cursorPosition: { x: adjustedX, y: adjustedY }, name: user.name });
            socket.emit('cursorPosition',{ id, cursorPosition: { x: adjustedX, y: adjustedY }, name: user.name });
        };

        const svgElement = svgRef.current;
        if (svgElement) {
            svgElement.addEventListener('mousemove', handleMouseMove);
            return () => {
                svgElement.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [camera, cursorPosition, socket, zoomLevel, throttledEmit]);


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

    useEffect(()=>
    {
        const handlePointerMove=(e)=>
        {
            throttledEmit('cursorPosition',{ id, cursorPosition, name: user.name });
            if(canvasState.mode===CanvasMode.Pencil && isDrawing)
            {
                setPencilDraft((prev)=>{
                    const newDraft=[ ...prev, { ...cursorPosition, pressure: e.pressure }];

                    throttledEmit('updatePencilDraft',{ id, newDraft });
                    return newDraft;
                });
            }
        };

        const handlePointerUp=(e)=>
        {
            if(canvasState.mode===CanvasMode.Pencil && isDrawing)
            {
                const newLayer={
                    id: nanoid(),
                    type: LayerType.Path,
                    points: pencilDraft,
                    color: "black",
                };

                console.log(pencilDraft);

                addLayer(newLayer);

                //websocket emit event
                throttledEmit("newLayer",newLayer);

                setPencilDraft([]);
                setIsDrawing(false);
            }
        }

        const svgElement=svgRef.current;
        svgElement.addEventListener('pointermove',handlePointerMove);
        svgElement.addEventListener('pointerup',handlePointerUp);

        return ()=>
        {
            svgElement.removeEventListener('pointermove',handlePointerMove);
            svgElement.removeEventListener('pointerup',handlePointerUp);
        };
    },[canvasState.mode, cursorPosition, isDrawing, setPencilDraft ]);

    const onPointerLeave = () => {

        if(canvasState.mode===CanvasMode.Pencil && isDrawing)
        {
            setPencilDraft([]);
            setIsDrawing(false);

            //TODO: When pointer leaves while drawing the draft remains until new draft is created
        }

        socket.emit("cursorLeave", { id });
        setCursorPosition(null);
    };

    const onPointerDown = useCallback((e) => {

        if (canvasState.mode === CanvasMode.Inserting) {
            return;
        }

        if (canvasState.mode === CanvasMode.Pencil) {
            setIsDrawing(true);
            return ;
        }

        setCanvasState({ origin: cursorPosition, mode: CanvasMode.Pressing });
    }, [canvasState.mode, cursorPosition, setCanvasState, setPencilDraft]);

    const onPointerUp = () => {

    };

    const getCursorStyle = () => {
        switch (canvasState.mode) {
            case CanvasMode.Inserting:
            case CanvasMode.Pencil:
                return 'crosshair'; // Set cursor to crosshair for inserting and pencil modes
            case CanvasMode.Hand:
                return 'grab';
            default:
                return 'auto'; // Set cursor to default for other modes
        }
    };

    return (
        <main className='h-full w-full relative bg-white touch-none' style={{ cursor: getCursorStyle() }}>
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
            />
            <svg
                ref={svgRef}
                className='h-[100vh] w-[100vw]'
                onWheel={onWheel}
                // onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerDown={onPointerDown}
                // onPointerUp={onPointerUp}
            >
                <GridBackground grid={grid} camera={camera} zoomLevel={zoomLevel} />

                <g
                    style={{
                        transform: `translate(${camera.x}px,${camera.y}px) scale(${zoomLevel})`
                    }}
                >

                    {layers && layers.map((layer)=>(
                        <LayerPreview layer={layer} />
                    ))}

                    <circle cx="50" cy="50" r="40" fill="blue" />

                    <CursorPresence />

                    {/* {cursorPosition && 
                    <Cursor
                        key={id}
                        userId={id}
                        name={user.name}
                        position={cursorPosition}
                    />} */}
                    {pencilDraft!=null && pencilDraft.length>0 && (
                        <Path 
                            points={pencilDraft} 
                            fill="black"
                            x={0}
                            y={0}
                        />
                    )}
                </g>
            </svg>
        </main>
    )
}

export default Canvas;