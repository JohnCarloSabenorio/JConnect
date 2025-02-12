import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, Component } from "react";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedInStatus: false,
      user: {},
      loading: true,
    };
  }
  componentDidMount() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    axios
      .get("http://localhost:3000/jconnect/api/v1/users/isLoggedIn", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == 200 && response.data.currentUser) {
          console.log("isLoggedIn");

          this.setState(
            {
              loggedInStatus: true,
              user: response.data.currentUser,
              loading: false,
            },
            () => console.log("Updated State:", this.state)
          );
        }
      })
      .catch((err) => {
        console.log(err);
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
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route
              element={<ProtectedRoutes status={this.state.loggedInStatus} />}
            >
              <Route path="/register" element={<Register />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}
