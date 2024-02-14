import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthenticate } from '../context/AuthContext';

const ProtectedRoute = () => {

  const { isAuthenticated }=useAuthenticate();

  return (isAuthenticated?<Outlet />:<Navigate to={'/signin'} replace={true} />);
}

export default ProtectedRoute;