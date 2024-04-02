export const formatItemName = (item) => {
    let prefix = "";
    const lastChar = item.name[item.name.length - 1];
    if (
        item.type === "Burgers" ||
        item.name.toUpperCase().includes("gig_em_patty_melt")
    ) {
        if (lastChar === "1") {
            prefix = "Bean ";
        } else if (lastChar === "0") {
            prefix = "Beef ";
        }
    } else if (item.name.toUpperCase().includes("fountain_drink")) {
        if (lastChar === "1") {
            prefix = "Large ";
        } else if (lastChar === "0") {
            prefix = "Small ";
        }
    }

    const formattedName =
        prefix +
        item.name
            .replace(/_/g, " ")
            .replace(/[0-9]/g, "")
            .split(" ")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")
            .replace(".", "");

    return formattedName;
};
