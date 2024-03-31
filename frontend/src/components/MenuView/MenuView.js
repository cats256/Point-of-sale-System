import { formatItemName } from "../../utils/formatItemName";
import { translate } from "../../network/api";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const MenuView = ({ languages, language, menuItems }) => {
    const [translatedMenuItems, setTranslatedMenuItems] = useState(null);

    useEffect(() => {
        const translateMenuItems = async () => {
            const translatedMenuItems = await Promise.all(
                menuItems.map(async (item) => {
                    if (language === "English (American)") {
                        return {
                            ...item,
                            translatedName: formatItemName(item),
                        };
                    }
                    const translatedName = await translate(
                        formatItemName(item),
                        languages[language]
                    );
                    return { ...item, translatedName };
                })
            );

            const menuItemsByType = translatedMenuItems.reduce((acc, item) => {
                if (!acc[item.type]) {
                    acc[item.type] = [];
                }
                acc[item.type].push(item);
                return acc;
            }, {});

            setTranslatedMenuItems(menuItemsByType);
        };

        translateMenuItems();
    }, [menuItems, language, languages]);

    if (!translatedMenuItems) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            {Object.keys(translatedMenuItems).map((type) => (
                <div key={type}>
                    <h2>{type}</h2>
                    <ul>
                        {translatedMenuItems[type].map((item) => (
                            <li key={item.id}>
                                {item.translatedName}- ${item.price}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
};

export { MenuView };
