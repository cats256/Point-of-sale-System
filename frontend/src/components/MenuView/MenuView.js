import { CircularProgress, Pagination, Stack } from "@mui/material";
import { Clock } from "digital-clock-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { translate } from "../../network/api";
import { formatItemName } from "../../utils/formatItemName";
import "./MenuView.css";

const MenuView = ({ languages, language, menuItems }) => {
    const [translatedMenuItems, setTranslatedMenuItems] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timerId = setInterval(() => {
            setPage((prevPage) =>
                (prevPage + 1) % 7 === 0 ? 1 : prevPage + 1
            );
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

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
                        formatItemName(item).toLowerCase(),
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

    const gridItems = Object.keys(translatedMenuItems).flatMap((type) => [
        ...translatedMenuItems[type].map((item, index) => (
            <div
                key={type + index}
                className="grid-item"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <img
                    src="/square_image.jpg"
                    alt={item.translatedName + " Image"}
                />
                <div
                    style={{
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        textAlign: "center",
                    }}
                >
                    {item.translatedName.toUpperCase()} - ${item.price}
                </div>
            </div>
        )),
    ]);

    const emptyItems = Array.from(
        { length: 48 - gridItems.length },
        (_, index) => (
            <div key={`empty-${index}`} className="grid-item">
                &nbsp;
            </div>
        )
    );

    gridItems.push(...emptyItems);

    return (
        <Stack
            style={{
                height: "100vh",
                padding: "32px 32px 0px 32px",
                fontFamily:
                    'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontVariant: "small-caps",
                fontSize: "16px",
                fontWeight: 500,
            }}
            spacing={2}
        >
            <div style={{ flexGrow: 1.5 }} className="grid-container">
                {gridItems.slice((page - 1) * 8, page * 8)}
            </div>
            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                }}
            >
                <div style={{ height: "80px", width: "200px" }}></div>
                <Pagination
                    count={6}
                    variant="outlined"
                    color="primary"
                    hidePrevButton
                    hideNextButton
                    page={page}
                />
                <Clock isMode24H size="small" />
            </div>
        </Stack>
    );
};

export { MenuView };
