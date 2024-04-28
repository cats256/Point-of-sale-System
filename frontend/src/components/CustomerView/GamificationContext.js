import { createContext, useState, useContext, useEffect } from 'react';

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({ children }) => {
    const [isGamified, setIsGamified] = useState(false);

    const toggleGamification = () => {
        setIsGamified(prev => !prev);
        /* if (isGamified) {
            playSound();
        } */
    };

    // Simple function to play sound effects
    const playSound = () => {
        const audio = new Audio('/path_to_sound_effect.mp3');
        audio.play();
    };

    return (
        <GamificationContext.Provider value={{ isGamified, toggleGamification }}>
            {children}
        </GamificationContext.Provider>
    );
};
