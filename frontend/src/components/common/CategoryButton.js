import React from "react";
import { Button } from "@mui/material";

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
