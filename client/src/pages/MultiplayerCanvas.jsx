import React from 'react';
import { useParams } from 'react-router-dom';
import { RoomProvider } from '../context/RoomContext';
import Canvas from '../components/multiplayer-canvas/Canvas';
import Header from '../components/multiplayer-canvas/Header';
import Toolbar from '../components/multiplayer-canvas/Toolbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MultiplayerCanvas = () => {

    const { workspaceId }=useParams();

  return (
    <RoomProvider workspaceId={workspaceId}>
        <div className='relative h-screen'>
            <Header />
            <Canvas />
            <Toolbar />
        </div>
    </RoomProvider>
  )
}

export default MultiplayerCanvas