import { CircularProgress, Pagination } from "@mui/material";
import { Clock } from "digital-clock-react";
import * as React from "react";
import { useEffect, useState } from "react";
import ReactWeather from "react-open-weather";

import "./MenuView.css";

const MenuView = ({
    weatherData,
    isWeatherLoading,
    weatherErrorMessage,
    translatedMenuItems,
}) => {
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timerId = setInterval(() => {
            setPage((prevPage) =>
                (prevPage + 1) % 8 === 0 ? 1 : prevPage + 1
            );
        }, 5000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

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
                    src={"/square_image.jpg"}
                    alt={item.translatedName + " Image"}
                />
                <div
                    style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
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
            {page === 1 ? (
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
                    {gridItems.slice((page - 2) * 8, (page - 1) * 8)}
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
                <div style={{ height: "80px", width: "200px" }}></div>
                <Pagination
                    count={7}
                    variant="outlined"
                    color="primary"
                    hidePrevButton
                    hideNextButton
                    page={page}
                />
                <Clock isMode24H size="small" />
            </div>
        </div>
    );
};

export { MenuView };
