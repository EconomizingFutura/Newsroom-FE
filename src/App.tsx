import React from "react";

import { BrowserRouter } from "react-router";
import Layout from "./Router/Routes";

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
