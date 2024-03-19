import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RoomProvider } from '../context/RoomContext';
import Canvas from '../components/multiplayer-canvas/Canvas';
import Header from '../components/multiplayer-canvas/Header';
import Toolbar from '../components/multiplayer-canvas/Toolbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CanvasProvider, useCanvas } from '../context/CanvasContext';
import { Resizable } from 'react-resizable';
import DocumentEditor from '../components/multiplayer-canvas/DocumentEditor';

const Layout=()=>
{

  const { activeTab }=useCanvas();

  return (
    <div className="flex justify-center">
      {/* When both tabs are active */}
      {activeTab === "both" && (
        <>
          <div style={{ width: "60%" }}>
            <Canvas />
            <Toolbar />
          </div>
          <div style={{ width: "40%" }}>
            <DocumentEditor />
          </div>
        </>
      )}

      {/* When only the canvas tab is active */}
      {activeTab === "canvas" && (
        <div style={{ width: "100%" }}>
          <Canvas />
          <Toolbar />
        </div>
      )}

      {/* When only the editor tab is active */}
      {activeTab === "editor" && (
        <div style={{ width: "100%" }}>
          <DocumentEditor />
        </div>
      )}
    </div>
  );
}

const MultiplayerCanvas = () => {

    const { workspaceId }=useParams();

  return (
    <RoomProvider workspaceId={workspaceId}>
      <CanvasProvider>
        <div className='relative h-screen'>
            <Header />
            <Layout />
            
        </div>
        </CanvasProvider>
    </RoomProvider>
  )
}

export default MultiplayerCanvas