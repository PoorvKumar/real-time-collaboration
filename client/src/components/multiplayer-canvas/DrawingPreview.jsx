import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Path from './Path';

const DrawingPreview = () => {

    const socket = useSocket();
    const [preview, setPreview] = useState([]);

    useEffect(() => {
        socket.on("svg:drawing", (data) => {
            // console.log(data);
            setPreview(data.drawings);
        });
        socket.on("canvas:update", (data) => {
            if (data.type === "object:added") {
                setPreview([]);
            }
        })

        return () => {
            socket.off("svg:drawing");
            socket.off("canvas:update");
        }
    }, []);

    return (
        <>
            <Path
                points={preview}
                x={0}
                y={0}
                fill={"black"}
            />
        </>
    )
}

export default DrawingPreview;