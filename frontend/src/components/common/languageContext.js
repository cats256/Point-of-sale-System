import React, { useEffect, useState, useContext } from "react";
import { getLanguages } from "../../network/api";

const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
    const [languages, setLanguages] = useState({});
    const [currLanguage, setCurrLanguage] = useState(``);

    useEffect(() => {
        getLanguages().then((data) => {
            setLanguages(data);
            setCurrLanguage(Object.keys(data)[5]);
        });
    }, []);

    return (
        <LanguageContext.Provider
            value={{ languages, setLanguages, currLanguage, setCurrLanguage }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
