import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import moment from "moment";
import "moment/locale/es";
import "./styles/custom.css";
import { BrowserRouter } from "react-router-dom";
moment.locale("es");

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);
