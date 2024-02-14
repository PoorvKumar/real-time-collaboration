import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthenticate } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {

  const { isAuthenticated } = useAuthenticate();

  return (

    isAuthenticated ? (
      children
    ) : (
      <Navigate to="/signin" replace={true} />
    )
  );
}

export default ProtectedRoute;