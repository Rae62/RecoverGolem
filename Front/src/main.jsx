import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import styles
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
