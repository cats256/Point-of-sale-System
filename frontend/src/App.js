import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { CashierView } from "./components/CashierView/CashierView";
import { CustomerView } from "./components/CustomerView/CustomerView";
import { ManagerView } from "./components/ManagerView/ManagerView";
import { MenuView } from "./components/MenuView/MenuView";
import { Login } from "./components/Authentication/login";
import { Logout } from "./components/Authentication/logout";
import { getLanguages, getMenuItems } from "./network/api";
import { Nav } from "./components/Authentication/navpage";
import { useVisualCrossing } from "react-open-weather";
import { useLocation } from "react-router-dom";
import { CircularProgress, Pagination } from "@mui/material";
import { formatItemName } from "./utils/formatItemName";
import { translate } from "./network/api";
import { gapi } from "gapi-script";

const clientID =
    "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function App() {
    const [menuItems, setMenuItems] = useState([]);
    const [translatedMenuItems, setTranslatedMenuItems] = useState(null);
    const [languages, setLanguages] = useState({});
    const [currLanguage, setCurrLanguage] = useState(``);
    const location = useLocation();
    sessionStorage.setItem("user_email", "");

    // may need to do something with API key exposure
    const { data, isLoading, errorMessage } = useVisualCrossing({
        key: "HLRHT43XJPSVMQHAMK7PDLL92",
        lat: "30.622370",
        lon: "-96.325851",
        lang: "en",
        unit: "us",
    });

    console.log(menuItems);

    useEffect(() => {
        getMenuItems().then((data) => setMenuItems(data));
        getLanguages().then((data) => {
            setLanguages(data);
            setCurrLanguage(Object.keys(data)[5]);
        });
        function start() {
            gapi.client.init({
                clientID: clientID,
                scope: "",
            });
        }

        gapi.load("client:auth2", start);
    }, []);

    useEffect(() => {
        const translateMenuItems = async () => {
            if (!menuItems || !currLanguage) {
                return;
            }

            const translatedMenuItems = await Promise.all(
                menuItems.map(async (item) => {
                    if (currLanguage === "English (American)") {
                        return {
                            ...item,
                            translatedName: formatItemName(item),
                        };
                    }
                    const translatedName = await translate(
                        formatItemName(item).toLowerCase(),
                        languages[currLanguage]
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
    }, [menuItems, currLanguage, languages]);

    const handleChange = (event) => {
        setCurrLanguage(event.target.value);
    };

    if (!languages) {
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

    if (location.pathname === "/") {
        return (
            <div style={{ margin: 10 }}>
                <Login />

                <div style={{ display: "none" }}>
                    <Logout />
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/nav" element={<Nav />} />

            <Route path="/manager" element={<ManagerView />} />
            <Route
                path="/cashier"
                element={
                    <CashierView
                        menuItems={menuItems}
                        languages={languages}
                        language={currLanguage}
                    />
                }
            />
            <Route
                path="/customer"
                element={<CustomerView menuItems={menuItems} />}
            />
            <Route
                path="/menu"
                element={
                    <MenuView
                        languages={languages}
                        language={currLanguage}
                        menuItems={menuItems}
                        weatherData={data}
                        isWeatherLoading={isLoading}
                        weatherErrorMessage={errorMessage}
                        translatedMenuItems={translatedMenuItems}
                    />
                }
            />
        </Routes>
    );
}

export default App;
