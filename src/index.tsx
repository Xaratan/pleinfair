import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { D3Test } from "./D3Test";
import { getZoomContextProvider } from "./contexts/ZoomContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const ZoomProvider = getZoomContextProvider();

root.render(
  <React.StrictMode>
    <ZoomProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/d3test" element={<D3Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ZoomProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
