import React from "react";
import { Button } from "@mui/material";

/**
 * Represents a category button component.
 *
 * @param {string} text - The text to display on the button.
 * @param {string} [panel=""] - The panel associated with the button.
 * @param {string} [img=""] - The URL of the image to display (optional).
 * @param {string} [alt=""] - The alt text for the image (optional).
 * @param {Function} setPanel - The function to set the panel.
 * @param {Function} setCurrType - The function to set the current type.
 * @param {string} currType - The current type.
 * @returns {JSX.Element} CategoryButton component JSX.
 */
const CategoryButton = ({
    text,
    panel = "",
    img = "",
    alt = "",
    setPanel,
    setCurrType,
    currType,
}) => (
    <Button
        variant="outlined"
        onClick={() => {
            setPanel(panel || text);
            setCurrType(text);
        }}
        style={{
            backgroundColor: currType === text ? "#C2A061" : "",
            flexGrow: 1,
            borderRadius: 0,
            borderWidth: 0,
            color: "black",
            borderBottom: "2px solid black",
        }}
    >
        {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
        {text}
    </Button>
);

export { CategoryButton };
