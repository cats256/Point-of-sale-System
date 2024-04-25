// statspage.js
import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TotalOrdersGraph from "./StatsDisplays/TotalOrdersGraph";
import MenuItemOrdersHistogram from "./StatsDisplays/MenuItemOrdersHistogram";
import IngredientUsageTable from "./StatsDisplays/IngredientUsageTable";
// import OrderTrendsTable from "./StatsDisplays/OrderTrendsTable";

const StatsPage = () => {
    const defaultStartDate = new Date(2024, 0, 1);
    const defaultEndDate = new Date(2024, 3, 15);

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [smoothingOption, setSmoothingOption] = useState("None");
    const [displayGraph, setDisplayGraph] = useState("TotalOrdersGraph");
    const smoothingOptions = ["None", "Savitzky-Golay Filter", "LOWESS"];

    return (
        <div style={{ marginLeft: "15%" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <Button
                    variant={displayGraph === "TotalOrdersGraph" ? "contained" : "outlined"}
                    onClick={() => setDisplayGraph("TotalOrdersGraph")}
                >
                    Total Orders Graph
                </Button>
                <Button
                    variant={displayGraph === "Histogram" ? "contained" : "outlined"}
                    onClick={() => setDisplayGraph("Histogram")}
                >
                    Menu Item Orders Histogram
                </Button>
                <Button
                    variant={displayGraph === "IngredientUsageTable" ? "contained" : "outlined"}
                    onClick={() => setDisplayGraph("IngredientUsageTable")}
                >
                    Ingredient Usage Table
                </Button>
                {/* <Button
                    variant={displayGraph === "OrderTrendsTable" ? "contained" : "outlined"}
                    onClick={() => setDisplayGraph("OrderTrendsTable")}
                >
                    Order Trends Table
                </Button> */}
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Start Date"
                    value={dayjs(startDate)}
                    onChange={(currentDate) =>
                        setStartDate(currentDate.toDate())
                    }
                />
                <DatePicker
                    label="End Date"
                    value={dayjs(endDate)}
                    onChange={(currentDate) =>
                        setEndDate(currentDate.toDate())
                    }
                />
                <FormControl style={{ width: "200px" }}>
                    <InputLabel>Smoothing Option</InputLabel>
                    <Select
                        value={smoothingOption}
                        label={smoothingOption}
                        onChange={(event) => {
                            setSmoothingOption(event.target.value);
                        }}
                    >
                        {smoothingOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </LocalizationProvider>
            {displayGraph === "TotalOrdersGraph" ? (
                <TotalOrdersGraph
                    start_date={startDate}
                    end_date={endDate}
                    smoothingOption={smoothingOption}
                />
            ) : displayGraph === "Histogram" ? (
                <MenuItemOrdersHistogram 
                    start_date={startDate}
                    end_date={endDate}
                />
            ) : (
                <IngredientUsageTable 
                    start_date={startDate}
                    end_date={endDate}
                />
            // ) : (
            //     <OrderTrendsTable
            //         start_date={startDate}
            //         end_date={endDate}
            //     />
            )}
        </div>
    );
};

export default StatsPage;
