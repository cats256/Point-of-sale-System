export const formatItemName = (item) => {
    return item.name
        .replace(/_/g, " ")
        .replace(/[0-9]/g, "")
        .split(" ")
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
        .replace(".", "");
};
