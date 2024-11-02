import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Tes from "./components/Tes";
import D3 from "./components/3D";
import D2 from "./components/2D";
import ResultRender from "./components/ResultRender";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <D3 /> */}
    {/* <D2 /> */}
    <ResultRender />
    {/* <Tes /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
