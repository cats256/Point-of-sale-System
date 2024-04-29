import React, { createContext, useContext, useState } from 'react';

const ZoomContext = createContext();

export const useZoom = () => useContext(ZoomContext);

export const ZoomProvider = ({ children }) => {
    const [zoom, setZoom] = useState(100);

    const increaseZoom = () => setZoom(zoom + 25);
    const decreaseZoom = () => setZoom(zoom > 100 ? zoom - 25 : 100);

    return (
        <ZoomContext.Provider value={{ zoom, increaseZoom, decreaseZoom }}>
            {children}
        </ZoomContext.Provider>
    );
};