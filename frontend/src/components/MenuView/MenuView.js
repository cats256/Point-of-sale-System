import { CircularProgress, Pagination } from "@mui/material";
import { Clock } from "digital-clock-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { translate } from "../../network/api";
import { formatItemName } from "../../utils/formatItemName";
import ReactWeather from "react-open-weather";
import Button from "@mui/material/Button";

import "./MenuView.css";

const MenuView = ({
    languages,
    language,
    menuItems,
    weatherData,
    isWeatherLoading,
    weatherErrorMessage,
}) => {
    const [translatedMenuItems, setTranslatedMenuItems] = useState(null);
    const [page, setPage] = useState(1);
    const [showWeather, setShowWeather] = useState(false);

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
            <div key={type + index} className="grid-item">
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
        <div
            style={{
                height: "100vh",
                padding: "32px 32px 0px 32px",
                fontFamily:
                    'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: "16px",
                fontWeight: 500,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {showWeather ? (
                <div
                    style={{
                        height: "80%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ReactWeather
                        isLoading={isWeatherLoading}
                        errorMessage={weatherErrorMessage}
                        data={weatherData}
                        lang="en"
                        locationLabel="College Station, TX"
                        unitsLabels={{ temperature: "F", windSpeed: "mph" }}
                        showForecast
                    />
                </div>
            ) : (
                <div style={{ height: "80%" }} className="grid-container">
                    {gridItems.slice((page - 1) * 8, page * 8)}
                </div>
            )}
            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                }}
            >
                <Button
                    style={{ height: "80px", width: "160px" }}
                    variant={showWeather ? "outlined" : "contained"}
                    onClick={() => setShowWeather((prev) => !prev)}
                >
                    {showWeather ? "Hide Weather" : "Show Weather"}
                </Button>
                {!showWeather && (
                    <Pagination
                        count={6}
                        variant="outlined"
                        color="primary"
                        hidePrevButton
                        hideNextButton
                        page={page}
                    />
                )}
                <Clock isMode24H size="small" />
            </div>
        </div>
    );
};

export { MenuView };
