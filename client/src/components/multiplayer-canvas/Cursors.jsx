import React from 'react'
import { useRoom } from '@/context/RoomContext';

const Cursors = () => {

    const { socket }=useRoom();

  return (
    <div>Cursors</div>
  )
}

export default Cursors