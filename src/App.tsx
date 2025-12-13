import { BrowserRouter } from "react-router";
import AppRoutes from "./Router/Routes";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("contextmenu", handleRightClick);
    return () => document.removeEventListener("contextmenu", handleRightClick);
  }, []);

  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        e.key == "F11" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U") ||
        e.key === "F11" ||
        e.key === "F10" ||
        (e.metaKey && e.key === "F") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockKeys);
    return () => document.removeEventListener("keydown", blockKeys);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
