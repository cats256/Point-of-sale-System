import React, { createContext, useState, useContext } from 'react';

const TextSizeContext = createContext();

export const useTextSize = () => useContext(TextSizeContext);

export const TextSizeProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState(16); // Starting font size in pixels

    const increaseFontSize = () => setFontSize(fontSize => fontSize + 2);
    const decreaseFontSize = () => setFontSize(fontSize => fontSize - 2);

    return (
        <TextSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize }}>
            {children}
        </TextSizeContext.Provider>
    );
};