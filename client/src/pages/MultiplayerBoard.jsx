import React from 'react'
import { useAuthenticate } from '../context/AuthContext';
import { redirect } from 'react-router-dom';
import Room from '../components/multiplayer-board/Room';
import Canvas from '../components/multiplayer-board/Canvas';

const MultiplayerBoard = () => {
  return (
    <Room>
      <Canvas />
    </Room>
  )
}

export default MultiplayerBoard;