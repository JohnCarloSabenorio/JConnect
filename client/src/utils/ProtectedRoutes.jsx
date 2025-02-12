import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

import { useEffect, useState } from "react";

// NEED TESTING
const ProtectedRoutes = ({ status }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    setIsAuthenticated(status);
    setLoading(false);
  }, [status]);

  if (loading) return <div>{isAuthenticated}</div>; // Prevent premature redirection

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
