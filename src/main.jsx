import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./data/store.js";
import { BrowserRouter as Router } from "react-router-dom";
import {grey} from "@mui/material/colors"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <App style={{backgroundColor: grey[100]}} />
    </Router>
  </Provider>
);
