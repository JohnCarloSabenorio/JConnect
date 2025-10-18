import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { createContext, useState, useEffect, Component } from "react";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
      setIsConnected(true);
    };
    const onDisconnect = () => {
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
      const response = await axios.get(
        "https://jconnect-server.onrender.com/api/v1/users/isLoggedIn",
        {
          withCredentials: true,
        }
      );

      // IMPROVE LOGIN HANDLING
      if (response.data.currentUser) {
        socket.auth = { userId: response.data.currentUser._id };
        socket.connect();
        socket.emit("change status", {
          status: "online",
        });

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
          setUser,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedFormRoutes />}>
              <Route index element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>

            <Route element={<ProtectedRoutes />}>
              <Route path="/chat" element={<Chat />} />
            </Route>

            <Route path="*" element={<NoPage />} />
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
