import React from 'react';
import { redirect, useParams } from 'react-router-dom';
import Canvas from '../components/multiplayer-board/Canvas';
import { RoomProvider, useRoom } from '../context/BoardContext';

const MultiplayerBoard = () => {

  const { boardId }=useParams();
  console.log(boardId);

  return (
    <RoomProvider workspaceId={boardId}>
      <Canvas boardId={boardId} />
    </RoomProvider>
  )
}

export default MultiplayerBoard;