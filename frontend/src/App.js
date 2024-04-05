import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CashierView } from "./components/CashierView/CashierView";
import { CustomerView } from "./components/CustomerView/CustomerView";
import { ManagerView } from "./components/ManagerView/ManagerView";
import { MenuView } from "./components/MenuView/MenuView"; 
import { getLanguages, getMenuItems } from "./network/api";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { BasketProvider } from '../src/components/CustomerView/BasketContext';
import { useVisualCrossing } from "react-open-weather";

function App() {
    const [menuItems, setMenuItems] = useState([]);
    const [languages, setLanguages] = useState({});
    const [currLanguage, setCurrLanguage] = useState("English (American)");

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
        setCurrLanguage(event.target.value);
    };

    return (
        <BrowserRouter>
            <BasketProvider>
                <div style = {{ margin: 10}}>
                    <Link to="/manager"><Button variant="outlined">Manager</Button></Link>
                    <Link to="/cashier"><Button variant="outlined">Cashier</Button></Link>
                    <Link to="/customer"><Button variant="outlined">Customer</Button></Link>
                    <Link to="/menu"><Button variant="outlined">Menu</Button></Link>

                    <FormControl>
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={currLanguage}
                            label={currLanguage}
                            onChange={handleChange}
                            >
                            {Object.keys(languages).map((currLanguage) => (
                                <MenuItem key={currLanguage} value={currLanguage}>
                                    {currLanguage}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <Routes>
                    <Route path="/manager" element={<ManagerView />} />
                    <Route path="/cashier" element={<CashierView />} />
                    <Route path="/customer" element={<CustomerView menuItems={menuItems} />} />
                    <Route path="/menu" element={<MenuView 
                                                languages={languages} 
                                                language={currLanguage} 
                                                menuItems={menuItems} 
                                                weatherData={data}
                                                isWeatherLoading={isLoading}
                                                weatherErrorMessage={errorMessage}
                                                />} />
                </Routes>
            </BasketProvider>
        </BrowserRouter>
    );
}

export default App;
