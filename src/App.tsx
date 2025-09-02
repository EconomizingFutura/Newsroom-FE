import React from "react";

import { BrowserRouter } from "react-router";
import AppRoutes from "./Router/Routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
