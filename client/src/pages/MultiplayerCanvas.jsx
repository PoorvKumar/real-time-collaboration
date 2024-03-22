import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RoomProvider } from '../context/RoomContext';
import Canvas from '../components/multiplayer-canvas/Canvas';
import Header from '../components/multiplayer-canvas/Header';
import Toolbar from '../components/multiplayer-canvas/Toolbar';
import 'react-toastify/dist/ReactToastify.css';
import { CanvasProvider, useCanvas } from '../context/CanvasContext';
import DocumentEditor from '../components/multiplayer-canvas/DocumentEditor';
import { CodeEditor } from '../components/multiplayer-canvas/CodeEditor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';

const Layout = () => {

  const { activeTab, setActiveTab } = useCanvas();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 768 && activeTab === 'both') {
      setActiveTab('canvas');
    }
  }, [windowWidth, activeTab, setActiveTab]);


  return (
    <div className="flex justify-center">
      {/* When both tabs are active, we can resize ourselves */}
      {activeTab === 'both' && (
        <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Canvas />
          <Toolbar />
        </ResizablePanel>
        <ResizableHandle withHandle={true} />
        <ResizablePanel>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
      )}

      {/* When only the canvas tab is active */}
      {activeTab === "canvas" && (
        <div className='w-full'>
          <Canvas />
          <Toolbar />
        </div>
      )}

      {/* When only the editor tab is active */}
      {activeTab === "editor" && (
        <div className='w-full'>
          <CodeEditor />
        </div>
      )}
    </div>
  );
}

const MultiplayerCanvas = () => {

  const { workspaceId } = useParams();

  return (
    <RoomProvider workspaceId={workspaceId}>
      <CanvasProvider>
        <div className='relative h-screen overflow-hidden'>
          <Header />
          <Layout />

        </div>
      </CanvasProvider>
    </RoomProvider>
  )
}

export default MultiplayerCanvas;