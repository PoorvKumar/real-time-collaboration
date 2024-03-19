import React, { useEffect, useState } from 'react'
import { useRoom } from '@/context/RoomContext';
import Cursor from './Cursor';

const Cursors = () => {

    const { socket }=useRoom();
    const [cursors,setCursors]=useState({});

    const updateCursor=({ userId, position, name, color })=>
    {
      setCursors((prev)=>({
        ...prev,
        [userId]: { position, name, color }
      }));
    };

    const removeCursor=({ userId })=>
    {
      setCursors((prev)=>{
        const updatedCursors={...prev};
        delete updatedCursors[userId];

        return updatedCursors;
      });
    }

    useEffect(()=>
    {
      if(!socket)
      {
        return;
      }

      socket.on("cursor:update",(data)=>
      {
        // console.log(data.position);
        updateCursor(data);
      });

      socket.on("cursor:leave",(data)=>
      {
        removeCursor(data);
      })

      return ()=>
      {
        socket.off("cursor:update");
        socket.off("cursor:leave");
      };
    },[socket]);

  return (
    <>
    {Object.entries(cursors).map(([userId, {position,name,color}])=>(
      <Cursor 
        key={userId}
        name={name}
        position={position}
        color={color}
      />
    ))}
    </>
  )
}

export default Cursors