import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {

    navigator.serviceWorker.register('./sw.js')

    .then(() => console.log('SW registrado'))

    .catch((err) => console.log('Error SW', err));

  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);