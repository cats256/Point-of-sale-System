import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import { ReactComponent as ReveilleLogo } from "../../img/reveille_logo.svg";
import { useFontSize } from "../../utils/FontSizeProvider";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import classNames from 'classnames';
import "./navBar.css";

const Accessibility = () => {
    const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
    const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
    const [longPressBtnEnabled, setLongPressBtnEnabled] = useState(false);
    const [highContrastEnabled, setHighContrastEnabled] = useState(false);
    const { toggleFontSize, toggleIconScale, fontSizeMultiplier } = useFontSize();
    
    return (
        <>
            <button
                aria-label="accessibility options"
                onClick={() =>
                    setShowAccessibilityPanel(!showAccessibilityPanel)
                }
                className="accessibilityBtn"
            >
                <SettingsAccessibilityIcon className="icon accessibilityIcon" style={{fill: "white"}}/>
            </button>
            {showAccessibilityPanel && (
                <div className="accessibilityContainer">
                    <button
                        onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
                        className="closeBtn"
                    >
                        <CloseIcon />
                    </button>

                    <span className="accessibilityTitle">
                        Accessibility Options
                    </span>

                    <div className="accessibilityOptions">
                        <button
                            className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': screenReaderEnabled })}
                            onClick={() =>setScreenReaderEnabled(!screenReaderEnabled)}
                            variant="contained"
                        >
                            {screenReaderEnabled ? 'Disable Screen Reader' : 'Enable Screen Reader'}
                        </button>

                        <button
                            className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': fontSizeMultiplier !== 1 })}
                            onClick={ () => {
                                toggleFontSize()
                                toggleIconScale()
                            }}
                            variant="contained"
                        >
                            {fontSizeMultiplier !== 1 ? 'Disable Large Text' : 'Enable Large Text'}
                        </button>

                        <button
                            className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': longPressBtnEnabled })}
                            onClick={() =>setLongPressBtnEnabled(!longPressBtnEnabled)}
                            variant="contained"
                        >
                            {longPressBtnEnabled ? 'Disable Long Press Buttons' : 'Enable Long Press Buttons'}
                        </button>

                        <button
                            className={classNames('accessibilityOptionBtn', { 'accessibilityOptionBtnActive': highContrastEnabled })}
                            onClick={() =>setHighContrastEnabled(!highContrastEnabled)}
                            variant="contained"
                        >
                            {highContrastEnabled ? 'Disable High Contrast' : 'Enable High Contrast'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const navBar = () => {
    return (
        <nav className="navBar">
            <div className="navSide">
                <Accessibility />
            </div>
            
            <header className="navHeader">
                <ReveilleLogo className="reveilleLogo" />
                <h1 className="navTitle">
                    Rev's American Grill
                </h1>
            </header>
            <div className="navSide">
                {/* TODO: add content */}
            </div>
        </nav>
    )
};

export {navBar};