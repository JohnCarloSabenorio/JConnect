import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
// NEED TESTING
const ProtectedFormRoutes = () => {
  const { loggedInStatus } = useContext(UserContext);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    setIsAuthenticated(loggedInStatus);
    setLoading(false);
  }, [loggedInStatus]);

  if (loading) return <div>{isAuthenticated}</div>; // Prevent premature redirection

  return !isAuthenticated ? <Outlet /> : <Navigate to="/chat" />;
};

export default ProtectedFormRoutes;
