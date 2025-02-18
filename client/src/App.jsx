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
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedInStatus: false,
      user: {},
      loading: true,
      isConnected: socket.connected,
    };
  }
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
  onConnect = () => {
    console.log("SOCKET CONNECTED!", socket.connected);
    this.setState({
      isConnected: socket.connected,
    });
  };

  onDisonnect = () => {
    console.log("SOCKET DISCONNECTED!");
    this.setState({
      isConnected: socket.connected,
    });
  };

  checkLoginStatus() {
    axios
      .get("http://localhost:3000/jconnect/api/v1/users/isLoggedIn", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == 200 && response.data.currentUser) {
          console.log("isLoggedIn");

          // Enable socket connection if user is logged in
          socket.connect();
          this.setState({
            loggedInStatus: true,
            user: response.data.currentUser,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);

        // Disable socket connection if user is logged in
        socket.disconnect();
        this.setState({
          loggedInStatus: false,
          user: {},
          loading: false,
        });
      });
  }

  render() {
    if (this.state.loading) {
      return <></>;
    }
    return (
      <>
        <UserContext.Provider
          value={{
            loggedInStatus: this.state.loggedInStatus,
            user: this.state.user,
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
}
