import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { createContext, useState, useEffect, Component } from "react";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ProtectedFormRoutes from "./utils/ProtectedFormRoutes";
import { socket } from "./socket";
export const UserContext = createContext();
export default function App() {
  const [loggedInStatus, setLoggedInStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      console.log("User has connected!");
      setIsConnected(true);
    };
    const onDisconnect = () => {
      console.log("User has disconnected!");
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    checkLoginStatus();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  async function checkLoginStatus() {
    try {
      const response = await axios.get("/jconnect/api/v1/users/isLoggedIn", {
        withCredentials: true,
      });

      // IMPROVE LOGIN HANDLING
      if (response.data.currentUser) {
        socket.auth = { userId: response.data.currentUser._id };
        socket.connect();
        setUser(response.data.currentUser);
        setLoggedInStatus(true);
      } else {
        setLoggedInStatus(false);
      }
    } catch (err) {
      console.log(err?.response?.data?.message || "Login check failed");
      socket.disconnect();
      setUser({});
      setLoggedInStatus(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <></>;
  return (
    <>
      <UserContext.Provider
        value={{
          loggedInStatus: loggedInStatus,
          user: user,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<NoPage />} />
            <Route element={<ProtectedFormRoutes />}>
              <Route index element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

/* 

  componentDidMount() {
    this.socketSetup();
    this.checkLoginStatus();
  }

  componentWillUnmount() {
    this.socketCleanup();
  }

  socketSetup() {
    socket.on("connect", this.onConnect);
    socket.on("disconnect", this.onDisonnect);
  }
  socketCleanup() {
    socket.off("connect", this.onConnect);
    socket.off("disconnect", this.onDisonnect);
  }

  // Socket handlers

*/
