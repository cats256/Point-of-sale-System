import SettingsAccessibilityIcon from "@mui/icons-material/AccessibilityNew";
import { ReactComponent as ReveilleLogo } from "../../img/reveille_logo.svg";
import { useFontSize } from "../../utils/FontSizeProvider";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import "./navBar.css";
import { useLanguage } from "./languageContext";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

/**
 * Component for managing accessibility options.
 *
 * @param {function} increaseZoom Function to increase zoom level.
 * @param {function} decreaseZoom Function to decrease zoom level.
 * @returns {JSX.Element} Accessibility component JSX.
 */
const Accessibility = ({ increaseZoom, decreaseZoom }) => {
    const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
    const [longPressBtnEnabled, setLongPressBtnEnabled] = useState(false);
    const [highContrastEnabled, setHighContrastEnabled] = useState(false);
    const { toggleFontSize, toggleIconScale, fontSizeMultiplier } =
        useFontSize();

    const toggleHighContrast = () => {
        setHighContrastEnabled(!highContrastEnabled);
        if (!highContrastEnabled) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
    };
    
    return (
        <>
            <button
                aria-label="accessibility options"
                onClick={() =>
                    setShowAccessibilityPanel(!showAccessibilityPanel)
                }
                className="accessibilityBtn"
            >
                <SettingsAccessibilityIcon
                    className="icon accessibilityIcon"
                    style={{ fill: "white" }}
                />
            </button>
            {showAccessibilityPanel && (
                <div className="accessibilityContainer">
                    <button
                        onClick={() =>
                            setShowAccessibilityPanel(!showAccessibilityPanel)
                        }
                        className="closeBtn"
                    >
                        <CloseIcon />
                    </button>

                    <span className="accessibilityTitle">
                        Accessibility Options
                    </span>

                    <div className="accessibilityOptions">

                        <button
                            className={classNames("accessibilityOptionBtn", {
                                accessibilityOptionBtnActive:
                                    fontSizeMultiplier !== 1,
                            })}
                            onClick={() => {
                                toggleFontSize();
                                toggleIconScale();
                            }}
                            variant="contained"
                        >
                            {fontSizeMultiplier !== 1
                                ? "Disable Large Text"
                                : "Enable Large Text"}
                        </button>

                        <button
                            className={classNames("accessibilityOptionBtn", {
                                accessibilityOptionBtnActive:
                                    longPressBtnEnabled,
                            })}
                            onClick={() =>
                                setLongPressBtnEnabled(!longPressBtnEnabled)
                            }
                            variant="contained"
                        >
                            {longPressBtnEnabled
                                ? "Disable Long Press Buttons"
                                : "Enable Long Press Buttons"}
                        </button>

                        <button
                            className={classNames("accessibilityOptionBtn", {
                                accessibilityOptionBtnActive:
                                    highContrastEnabled,
                            })}
                            onClick={() => {
                                setHighContrastEnabled(!highContrastEnabled)
                                toggleHighContrast()
                            }}
                            variant="contained"
                        >
                            {highContrastEnabled
                                ? "Disable High Contrast"
                                : "Enable High Contrast"}
                        </button>

                        <button
                            className="accessibilityOptionBtn"
                            aria-label="Increase Zoom"
                            onClick={increaseZoom}
                            variant="contained"
                        >
                            Zoom In (+)
                        </button>
                        <button
                            className="accessibilityOptionBtn"
                            aria-label="Decrease Zoom"
                            onClick={decreaseZoom}
                            variant="contained"
                        >
                            Zoom Out (-)
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

/**
 * Component for rendering the navigation bar.
 *
 * @param {function} increaseZoom Function to increase zoom level.
 * @param {function} decreaseZoom Function to decrease zoom level.
 * @param {number} zoom The current zoom level.
 * @returns {JSX.Element} NavBar component JSX.
 */
const NavBar = ({ increaseZoom, decreaseZoom, zoom }) => {
    const { languages, setLanguages, currLanguage, setCurrLanguage } =
        useLanguage();

    const handleChange = (event) => {
        setCurrLanguage(event.target.value);
    };

    return (
        <nav className="navBar">
            <div className="navSide left">
                <Accessibility
                    increaseZoom={increaseZoom}
                    decreaseZoom={decreaseZoom}
                    zoom={zoom}
                />
            </div>
            <Link to="/nav" className="linkWithoutUnderline">
                <header className="navHeader">
                    <ReveilleLogo className="reveilleLogo" />
                    <h1 className="navTitle">Rev's American Grill</h1>
                </header>
            </Link>
            <div className="navSide right">
                <FormControl
                    variant="filled"
                    style={{
                        color: "white",
                        backgroundColor: "white",
                        width: "184px",
                    }}
                >
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={currLanguage}
                        label="Language"
                        onChange={handleChange}
                    >
                        {Object.keys(languages).map((lang) => (
                            <MenuItem key={lang} value={lang}>
                                {lang}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </nav>
    );
};

export default NavBar;
