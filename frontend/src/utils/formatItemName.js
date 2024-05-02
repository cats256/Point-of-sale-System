/**
 * Formats an item name by replacing underscores with spaces, removing numbers,
 * capitalizing the first letter of each word, and removing periods.
 * @param {object} item - The item object containing a name property.
 * @param {string} item.name - The name of the item to be formatted.
 * @returns {string} - The formatted item name.
 */
export const formatItemName = (item) => {
    return item.name
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/[0-9]/g, "") // Remove numbers
        .split(" ") // Split the name into words
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize the first letter of each word
        .join(" ") // Join the words back together
        .replace(".", ""); // Remove periods
};
