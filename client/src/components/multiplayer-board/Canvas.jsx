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
    const throttledEmit = useThrottledEmit(socket);

    const [grid, setGrid] = useState({
        enable: false,
        isSquare: false,
    });

    // Pencil Drawing
    const [pencilDraft, setPencilDraft] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    //Grabbing and Panning
    const [lastPointerPosition, setLastPointerPosition] = useState({ x: 0, y: 0 });

    //Inserting Layer
    const [startPosition, setStartPosition] = useState(null);
    const [endPosition, setEndPosition] = useState(null);
    const [layerDraft, setLayerDraft] = useState(null);

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
            socket.emit('cursorPosition', { id, cursorPosition: { x: adjustedX, y: adjustedY }, name: user.name });
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

    const onPointerMove = (e) => {
        if (canvasState.mode === CanvasMode.Translating) {
            e.preventDefault();
            const deltaX = (e.clientX - lastPointerPosition.x) / zoomLevel;
            const deltaY = (e.clientY - lastPointerPosition.y) / zoomLevel;

            setCamera((prevCamera) => ({
                x: prevCamera.x + deltaX,
                y: prevCamera.y + deltaY
            }));

            setLastPointerPosition({ x: e.clientX, y: e.clientY });
        }
    };

    useEffect(() => {
        const handlePointerMove = (e) => {

            throttledEmit('cursorPosition', { id, cursorPosition, name: user.name });

            if (canvasState.mode === CanvasMode.Pencil && isDrawing) {
                setPencilDraft((prev) => {
                    const newDraft = [...prev, { ...cursorPosition, pressure: e.pressure }];

                    throttledEmit('updatePencilDraft', { id, newDraft });
                    return newDraft;
                });
                return;
            }

            if (canvasState.mode === CanvasMode.Inserting && startPosition) {
                setEndPosition(cursorPosition);

                setLayerDraft((prevDraft) => ({
                    ...prevDraft,
                    points: [startPosition, endPosition]
                }));

                throttledEmit('updateLayerDraft', { id, type: canvasState.layerType, startPosition, endPosition: cursorPosition });
                return;
            }
        };

        const handlePointerUp = (e) => {

            let newLayer;

            if (canvasState.mode === CanvasMode.Pencil && isDrawing) {
                newLayer = {
                    id: nanoid(),
                    type: LayerType.Path,
                    points: pencilDraft,
                    color: "black",
                };

                // console.log(pencilDraft);

                // addLayer(newLayer);

                // //websocket emit event
                // throttledEmit("newLayer", newLayer);

                setPencilDraft([]);
                setIsDrawing(false);
            }

            if (canvasState.mode === CanvasMode.Inserting && startPosition) {
                if (!endPosition) {
                    setEndPosition(cursorPosition);
                }

                newLayer = {
                    id: nanoid(),
                    type: canvasState.layerType,
                    points: [startPosition, cursorPosition],
                    color: "black",
                    x: startPosition.x,
                    y: startPosition.y
                };

                // addLayer(newLayer);

                setStartPosition(null);
                setEndPosition(null);
                setLayerDraft(null);
            }

            if (newLayer) {
                addLayer(newLayer);
                // console.log(newLayer);
                throttledEmit("newLayer", newLayer);
            }
        }

        const svgElement = svgRef.current;
        svgElement.addEventListener('pointermove', handlePointerMove);
        svgElement.addEventListener('pointerup', handlePointerUp);

        return () => {
            svgElement.removeEventListener('pointermove', handlePointerMove);
            svgElement.removeEventListener('pointerup', handlePointerUp);
        };
    }, [canvasState.mode, cursorPosition, isDrawing, setPencilDraft, throttledEmit, endPosition]);

    const onPointerLeave = () => {

        if (canvasState.mode === CanvasMode.Pencil && isDrawing) {
            setPencilDraft([]);
            setIsDrawing(false);

            //TODO: When pointer leaves while drawing the draft remains until new draft is created
        }

        if (canvasState.mode === CanvasMode.Inserting && startPosition) {
            setStartPosition(null);
            setEndPosition(null);
            setLayerDraft(null);
        }

        socket.emit("cursorLeave", { id });
        setCursorPosition(null);
    };

    const onPointerDown = useCallback((e) => {
        if (canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text) {
            // setStartPosition(cursorPosition);
            return;
        }

        if (canvasState.mode === CanvasMode.Inserting) {
            setStartPosition(cursorPosition);
            setEndPosition(cursorPosition);
            setLayerDraft({
                type: canvasState.layerType,
                x: cursorPosition.x,
                y: cursorPosition.y,
                points: [cursorPosition, cursorPosition]
            });
            return;
        }

        if (canvasState.mode === CanvasMode.Pencil) {
            setIsDrawing(true);
            return;
        }

        if (e.button===1 || canvasState.mode === CanvasMode.Hand) {
            setCanvasState({ ...canvasState, mode: CanvasMode.Translating });
            setLastPointerPosition({ x: e.clientX, y: e.clientY });
            return;
        }

        setCanvasState({ origin: cursorPosition, mode: CanvasMode.Pressing });
    }, [canvasState.mode, cursorPosition, setCanvasState, setPencilDraft]);

    const onPointerUp = (e) => {
        if (canvasState.mode === CanvasMode.Translating || e.button===1) {
            setCanvasState({ ...canvasState, mode: CanvasMode.Hand });
        }

        if (canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text) {
            
            const newTextLayer = {
                id: nanoid(),
                type: LayerType.Text,
                points: [cursorPosition,cursorPosition],
                content: "Text"
            };

            socket.emit("newLayer", newTextLayer);

            addLayer(newTextLayer);

            setCanvasState({
                mode: CanvasMode.None
            });
        }
    };

    const getCursorStyle = () => {
        switch (canvasState.mode) {
            case CanvasMode.Inserting:
            case CanvasMode.Pencil:
                return 'crosshair'; // Set cursor to crosshair for inserting and pencil modes
            case CanvasMode.Hand:
                return 'grab';
            case CanvasMode.Translating:
                return 'grabbing';
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

                    {layers && layers.map((layer) => (
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
                    {pencilDraft != null && pencilDraft.length > 0 && (
                        <Path
                            points={pencilDraft}
                            fill="black"
                            x={0}
                            y={0}
                        />
                    )}
                    {layerDraft && (
                        <LayerPreview layer={layerDraft} />
                    )}
                </g>
            </svg>
        </main>
    )
}

export default Canvas;