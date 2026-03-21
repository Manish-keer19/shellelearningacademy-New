import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const APP_VERSION = "19";    // <-- change this to "2", "3", "4"... whenever you want a reset

if (localStorage.getItem("appVersion") !== APP_VERSION) {

  console.group("LocalStorage Cleanup (First time OR version changed)");

  // Save version BEFORE clearing
  localStorage.setItem("appVersion", APP_VERSION);

  // Clear all other keys
  Object.keys(localStorage).forEach(key => {
    if (key !== "appVersion") {
      localStorage.removeItem(key);
    }
  });

  console.groupEnd();

  console.log("✅ Storage cleared because version changed.");
}




createRoot(document.getElementById("root")!).render(
  <App />
);
