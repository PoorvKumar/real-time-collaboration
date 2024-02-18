import React, { useEffect, useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import LayerPreview from './LayerPreview';
import { getLayerData } from '@/lib/utils';

const LayerDrafts=()=>
{
    const { socket }=useRoom();
    const [layerDrafts,setLayerDrafts]=useState({});

    useEffect(() => {
        if (!socket) {
            console.log(socket);
            return;
        }

        socket.on('updateLayerDraft', data => {
            const { id, type, startPosition, endPosition } = data;
            setLayerDrafts(prevDrafts => ({
                ...prevDrafts,
                [id]: { type, startPosition, endPosition },
            }));
        });

        return () => {
            socket.off('updateLayerDraft');
        };
    }, [socket]);

    // console.log(layerDrafts);

    return (
        <>
            {Object.entries(layerDrafts).map(([ id, type, startPosition, endPosition ])=>(
                <LayerPreview key={id} layer={getLayerData(type,startPosition,endPosition)} />
            ))}
        </>
    )
};

export default LayerDrafts;