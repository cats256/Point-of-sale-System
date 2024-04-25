import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { BasketProvider } from "./components/CustomerView/BasketContext";
import { FontSizeProvider } from "../src/utils/FontSizeProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <FontSizeProvider>
                <BasketProvider>
                    <App />
                </BasketProvider>
            </FontSizeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
