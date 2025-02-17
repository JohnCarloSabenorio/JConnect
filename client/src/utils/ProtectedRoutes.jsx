import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
// NEED TESTING
const ProtectedRoutes = () => {
  const location = useLocation();

  console.log("Current Path:", location.pathname);
  const { loggedInStatus } = useContext(UserContext);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    setIsAuthenticated(loggedInStatus);
    setLoading(false);
  }, [loggedInStatus]);

  if (loading) return <div>{isAuthenticated}</div>; // Prevent premature redirection

  // Checks if the user is logged in when accessing register and login page
  if((location.pathname === "/" || location.pathname === "/register") && isAuthenticated){
    return <Navigate to="/chat" />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
