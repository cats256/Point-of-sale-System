import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { CashierView } from "./components/CashierView/CashierView";
import { CustomerView } from "./components/CustomerView/CustomerView";
import { ManagerView } from "./components/ManagerView/ManagerView";
import { MenuView } from "./components/MenuView/MenuView";
import { getLanguages, getMenuItems } from "./network/api";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { BasketProvider } from '../src/components/CustomerView/BasketContext';
import ReactWeather, { useVisualCrossing } from "react-open-weather";

function App() {
    const [panel, setPanel] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [languages, setLanguages] = useState({});
    const [language, setLanguage] = useState("English (American)");

    // may need to do something with API key exposure
    const { data, isLoading, errorMessage } = useVisualCrossing({
        key: "HLRHT43XJPSVMQHAMK7PDLL92",
        lat: "30.622370",
        lon: "-96.325851",
        lang: "en",
        unit: "us",
    });

    useEffect(() => {
        getMenuItems().then((data) => setMenuItems(data));
        getLanguages().then((data) => setLanguages(data));
    }, []);

    const handleChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <BasketProvider>
            { panel ? (
                (() => {
                    switch (panel) {
                        case "manager":
                            return <ManagerView />;
                        case "cashier":
                            return <CashierView />;
                        case "customer":
                            return <CustomerView menuItems={menuItems} />;
                        case "menu":
                            return (
                                <MenuView
                                    languages={languages}
                                    language={language}
                                    menuItems={menuItems}
                                    weatherData={data}
                                    isWeatherLoading={isLoading}
                                    weatherErrorMessage={errorMessage}
                                />
                            );
                        default:
                            return null;
                    }
                })()
            ) : (
                <div>Choose a panel</div>
                <Button variant="outlined" onClick={() => setPanel("manager")}>
                    Manager
                </Button>
                <Button variant="outlined" onClick={() => setPanel("cashier")}>
                    Cashier
                </Button>
                <Button variant="outlined" onClick={() => setPanel("customer")}>
                    Customer
                </Button>
                <Button variant="outlined" onClick={() => setPanel("menu")}>
                    Menu
                </Button>
            )}
            <FormControl>
                <InputLabel>Language</InputLabel>
                <Select
                    value={language}
                    label={language}
                    onChange={handleChange}
                >
                    {Object.keys(languages).map((language) => (
                        <MenuItem key={language} value={language}>
                            {language}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </BasketProvider>
    );
}

export default App;
