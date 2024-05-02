/**
 * Determines the color associated with an item name based on predefined mappings.
 * @param {string} itemName - The name of the item for which to determine the color.
 * @returns {string} - The color associated with the item name. Returns "inherit" if no match is found.
 */
export const getItemNameColor = (itemName) => {
    const colorMap = {
        Beef: "#efdcfc",
        Bean: "#fffdd4",
        Tender: "#fff2c9",
        "Steak Finger": "#efdcfc",
        Sandwich: "#e8fce8",
        "Grilled Cheese": "#fff5e3",
        Coffee: "#d4c0b8",
        "Fountain Drink": "#e3f8ff",
        Scoop: "#fffef0",
        Cookie: "#d4c0b8",
        Brownie: "#d4c0b8",
        Shake: "#ffdef3",
        Fries: "#fff2c9",
        Tots: "#fff2c9",
        Rings: "#fff2c9",
        Chips: "#fff2c9",
        Sauce: "#deb0a9",
        Mustard: "#fff2c9",
        Ranch: "#e8ffff",
    };

    for (let key in colorMap) {
        if (itemName.includes(key)) {
            return colorMap[key];
        }
    }
    return "inherit";
};
