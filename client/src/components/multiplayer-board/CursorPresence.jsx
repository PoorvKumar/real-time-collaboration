import React, { useEffect, useState } from 'react';
import Cursor from './Cursor';
import { useRoom } from '@/context/RoomContext';

const CursorPresence = () => {

    const { socket }=useRoom();

    const [userCursorPositions, setUserCursorPositions] = useState({});

    const updateUserCursorPosition = ({ userId, cursorPosition }) => {
        setUserCursorPositions((prevUserCursorPositions) => ({
            ...prevUserCursorPositions,
            [userId]: { position: cursorPosition }
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
            {Object.entries(userCursorPositions).map(([userId, { position }]) => (
                <Cursor
                    key={userId}
                    position={position}
                />
            ))}
        </>
    )
}

export default CursorPresence;