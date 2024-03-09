import React, { useEffect, useState } from 'react'
import { useRoom } from '@/context/RoomContext';
import Cursor from './Cursor';

const Cursors = () => {

    const { socket }=useRoom();
    const [cursors,setCursors]=useState({});

    const updateCursor=({ userId, position, name })=>
    {
      setCursors((prev)=>({
        ...prev,
        [userId]: { position, name }
      }));
    }

    useEffect(()=>
    {
      if(!socket)
      {
        return;
      }

      console.log(cursors);

      socket.on("cursor:update",(data)=>
      {
        console.log(data);
        updateCursor(data);
      });

      return ()=>
      {
        socket.off("cursor:update");
      };
    },[socket]);

  return (
    <>
    {Object.entries(cursors).map(([userId, {position,name}])=>(
      <Cursor 
        key={userId}
        userId={userId}
        name={name}
        position={position} 
      />
    ))}
    </>
  )
}

export default Cursors