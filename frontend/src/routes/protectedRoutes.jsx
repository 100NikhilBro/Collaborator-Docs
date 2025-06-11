import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const auth = !!localStorage.getItem('authToken'); 

  if (auth) {
    return children; 
  } else {
    return <Navigate to="/login" replace />; 
  }
};

export default ProtectedRoutes;
