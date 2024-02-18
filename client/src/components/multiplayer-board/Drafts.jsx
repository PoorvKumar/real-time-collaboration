import React, { useEffect, useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import Path from './Path';

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

export default Drafts;