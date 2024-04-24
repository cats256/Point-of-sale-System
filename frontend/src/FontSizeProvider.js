// import React, { createContext, useContext, useState, useEffect } from 'react';

// const FontSizeContext = createContext();

// export const FontSizeProvider = ({ children }) => {
//     const [fontSizeMultiplier, setFontSizeMultiplier] = useState(2); 
//     // The Web Content Accessibility Guidelines (WCAG 2.0) recommend ensuring that text can be zoomed to 200%.

//     useEffect(() => {
//         // Update the CSS variable on the root element
//         const rootStyle = document.documentElement.style;
//         rootStyle.setProperty('--dynamic-font-size', `${fontSizeMultiplier * 18}px`); // Assumes default size is 16px
//     }, [fontSizeMultiplier]);

//     return (
//         <FontSizeContext.Provider value={{ setFontSizeMultiplier }}>
//             {children}
//         </FontSizeContext.Provider>
//     );
// };

// export const useFontSize = () => useContext(FontSizeContext);


import React, { createContext, useContext, useState , useEffect} from 'react';

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);  // Default to 1

    const value = {
        fontSizeMultiplier,
        setFontSizeMultiplier
    };

    useEffect(() => {
        document.documentElement.style.setProperty('--dynamic-font-size', `${18 * fontSizeMultiplier}px`);
    }, [fontSizeMultiplier]);
    

    return (
        <FontSizeContext.Provider value={value}>
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => useContext(FontSizeContext);
