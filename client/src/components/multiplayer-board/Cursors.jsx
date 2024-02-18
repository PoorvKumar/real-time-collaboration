import React, { useEffect, useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import Cursor from './Cursor';

const Cursors = () => {

    const { socket }=useRoom();

    const [userCursorPositions, setUserCursorPositions] = useState({});

    const updateUserCursorPosition = ({ id, cursorPosition, name }) => {
        setUserCursorPositions((prevUserCursorPositions) => ({
            ...prevUserCursorPositions,
            [id]: { position: cursorPosition, name }
        }));
    };

    const removeUserCursorPosition=(id)=>
    {
        setUserCursorPositions((prev)=>{
            const updatedPositions={ ...prev };
            delete updatedPositions[id];

            return updatedPositions;
        })   
    };

    useEffect(() => {

        if(!socket)
        {
            return ;
        }

        socket.on("updateCursorPosition", (data) => {
            // console.log(data);
            updateUserCursorPosition(data);
        });

        socket.on("cursorLeave",(data)=>
        {
            removeUserCursorPosition(data.id);
        });

        return ()=>
        {
            socket.off("updateCursorPosition");
            socket.off("cursorLeave");
        }

    }, [socket]);

    return (
        <>
            {/* Render the canvas content here */}
            {Object.entries(userCursorPositions).map(([id, { position, name }]) => (
                <Cursor
                    key={id}
                    userId={id}
                    name={name}
                    position={position}
                />
            ))}
        </>
    )
};

export default Cursors;