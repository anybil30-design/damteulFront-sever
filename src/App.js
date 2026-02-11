// src/App.js
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/routerIndex";
import './styles/reset.css';
import './styles/base.css';
export default function App() {
  return(
    
    <RouterProvider router={router} />
  );
}
