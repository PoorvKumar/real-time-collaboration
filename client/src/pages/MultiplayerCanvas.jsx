import React from 'react';
import { useParams } from 'react-router-dom';
import { RoomProvider } from '../context/RoomContext';
import Canvas from '../components/multiplayer-canvas/Canvas';
import Header from '../components/multiplayer-canvas/Header';
import Toolbar from '../components/multiplayer-canvas/Toolbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CanvasProvider } from '../context/CanvasContext';

const MultiplayerCanvas = () => {

    const { workspaceId }=useParams();

  return (
    <RoomProvider workspaceId={workspaceId}>
      <CanvasProvider>
        <div className='relative h-screen'>
            <Header />
            <Canvas />
            <Toolbar />
        </div>
        </CanvasProvider>
    </RoomProvider>
  )
}

export default MultiplayerCanvas