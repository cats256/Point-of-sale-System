import React, { createContext, useContext, useState } from 'react';

/**
 * Context for managing zoom level state and functions.
 */
const ZoomContext = createContext();

/**
 * Custom hook for accessing zoom context values.
 *
 * @returns {object} Zoom context values.
 */
export const useZoom = () => useContext(ZoomContext);

/**
 * Provider component for managing zoom level state and functions.
 *
 * @param {object} children The child components to be wrapped by the provider.
 * @returns {JSX.Element} ZoomProvider component JSX.
 */
export const ZoomProvider = ({ children }) => {
    const [zoom, setZoom] = useState(100);

    /**
     * Function to increase the zoom level by 25%.
     */
    const increaseZoom = () => setZoom(zoom + 25);

    /**
     * Function to decrease the zoom level by 25%, with a minimum zoom level of 100%.
     */
    const decreaseZoom = () => setZoom(zoom > 100 ? zoom - 25 : 100);

    return (
        <ZoomContext.Provider value={{ zoom, increaseZoom, decreaseZoom }}>
            {children}
        </ZoomContext.Provider>
    );
};