import React from "react";
import App from "./App";
import { AdminPage } from "./components/AdminPage";

export function Root() {
  if (window.location.pathname === "/admin") {
    return <AdminPage />;
  }
  return <App />;
}
