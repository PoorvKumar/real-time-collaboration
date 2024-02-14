import { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import MultiplayerBoard from './pages/MultiplayerBoard';
import { useAuthenticate } from './context/AuthContext';
import Landing from './pages/Landing';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';

function App() {

  const { isAuthenticated, loading } = useAuthenticate();

  console.log(loading);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={isAuthenticated ? <Dashboard /> : <Landing />} />
        {/* <ProtectedRoute path='/board/:boardId' element={<MultiplayerBoard />} /> */}
        <Route
          path='/board/:boardId'
          element={
            <ProtectedRoute>
              <MultiplayerBoard />
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
