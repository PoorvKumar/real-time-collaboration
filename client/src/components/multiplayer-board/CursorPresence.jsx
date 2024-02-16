import React, { useEffect, useState } from 'react';
import Cursor from './Cursor';
import { useRoom } from '@/context/RoomContext';

const CursorPresence = () => {

    const { socket }=useRoom();

    const [userCursorPositions, setUserCursorPositions] = useState({});

    const updateUserCursorPosition = ({ userId, cursorPosition, camera }) => {
        setUserCursorPositions((prevUserCursorPositions) => ({
            ...prevUserCursorPositions,
            [userId]: { position: cursorPosition, camera: camera }
        }));
    };

    useEffect(() => {

        if(!socket)
        {
            return ;
        }

        socket.on("updateCursorPosition", (data) => {
            console.log(data);
            updateUserCursorPosition(data);
        });
    }, []);

    return (
        <>
            {/* Render the canvas content here */}
            {Object.entries(userCursorPositions).map(([userId, { position, camera }]) => (
                <Cursor
                    key={userId}
                    position={position}
                    camera={camera}
                />
            ))}
        </>
    )
}

export default CursorPresence;