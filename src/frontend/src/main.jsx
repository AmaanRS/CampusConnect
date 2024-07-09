import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { BrowserRouter } from "react-router-dom";
import Modal from "react-modal";
import AuthProvider from "./Components/Axios/AuthContext.jsx";

// Set the app element for accessibility
Modal.setAppElement("#root"); // Assuming your root element has an id of 'root'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
