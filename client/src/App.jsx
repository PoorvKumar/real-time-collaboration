import { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MultiplayerCanvas from './pages/MultiplayerCanvas';

function App() {
  return (
    <Routes>
      <Route path='/' element={<MultiplayerCanvas />} />
    </Routes>
  )
}

export default App
