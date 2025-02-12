import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
