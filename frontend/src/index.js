import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { BasketProvider } from "./components/common/BasketContext";
import { FontSizeProvider } from "../src/utils/FontSizeProvider";
import { LanguageProvider } from "./components/common/languageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <FontSizeProvider>
                    <BasketProvider>
                        <App />
                    </BasketProvider>
                </FontSizeProvider>
            </LanguageProvider>
        </BrowserRouter>
    </React.StrictMode>
);
