import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Context for managing font size and icon scale in the application.
 * @type {React.Context<Object>}
 */

const FontSizeContext = createContext();

/**
 * Provider component for managing font size and icon scale.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */

export const FontSizeProvider = ({ children }) => {
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1); // Default to 1
    const [iconScaleMultiplier, setIconScaleMultiplier] = useState(1);

    const toggleFontSize = () => {
        setFontSizeMultiplier(fontSizeMultiplier === 1 ? 2 : 1); // Toggle between 1 and 2
    };

    const toggleIconScale = () => {
        setIconScaleMultiplier((currentScale) => (currentScale === 1 ? 2 : 1));
    };

    const value = {
        fontSizeMultiplier,
        setFontSizeMultiplier,
        toggleFontSize,
        iconScaleMultiplier,
        setIconScaleMultiplier,
        toggleIconScale,
    };

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--dynamic-font-size",
            `${20 * fontSizeMultiplier}px`
        );
        document.documentElement.style.setProperty(
            "--dynamic-icon-scale",
            `${iconScaleMultiplier}`
        );
    }, [fontSizeMultiplier, iconScaleMultiplier]);

    return (
        <FontSizeContext.Provider value={value}>
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => useContext(FontSizeContext);
