import React, { useEffect, useState } from 'react';
import Cursor from './Cursor';
import { useRoom } from '@/context/RoomContext';
import Path from './Path';

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

const Drafts=()=>
{
    const { socket }=useRoom();
    const [pencilDrafts,setPencilDrafts]=useState({});

    useEffect(() => {
        if (!socket) {
            console.log(socket);
            return;
        }

        socket.on('updatePencilDraft', data => {
            const { id, newDraft } = data;
            setPencilDrafts(prevDrafts => ({
                ...prevDrafts,
                [id]: newDraft,
            }));
        });

        return () => {
            socket.off('updatePencilDraft');
        };
    }, [socket]);

    return (
        <>
            {Object.entries(pencilDrafts).map(([id,draft])=>(
                <Path key={id} points={draft} fill="black" x={0} y={0} />
            ))}
        </>
    )
};

const CursorPresence=()=>
{
    return (
        <>
            <Drafts />
            <Cursors />
        </>
    )
};

export default CursorPresence;