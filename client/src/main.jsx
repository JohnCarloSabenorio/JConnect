import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
const root = createRoot(document.getElementById("root"));
import React from "react";
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
