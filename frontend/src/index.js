import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { BasketProvider } from "./components/CustomerView/BasketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <BasketProvider>
                <App />
            </BasketProvider>
        </BrowserRouter>
    </React.StrictMode>
);
