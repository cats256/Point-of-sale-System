import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useState } from "react";
import { categories } from "../../utils/const";
import { formatItemName } from "../../utils/formatItemName";
import { getItemNameColor } from "../../utils/getItemNameColor";
import { useBasket } from "../CustomerView/BasketContext";
import { CategoryButton } from "../common/CategoryButton";
import "./CashierView.css";

export const handleMakeCombo = (choice, menuItems, addItemToBasket, setOpenDialog) => {
    setOpenDialog(false);

    if (choice === "kettleChips") {
        const kettleChipsItem = menuItems.find((item) =>
            item.name.toLowerCase().includes("kettle")
        );
        const smallDrinkItem = menuItems.find((item) =>
            item.name.toLowerCase().includes("drink")
        );

        const modifiedChipsItem = kettleChipsItem
            ? { ...kettleChipsItem, price: 1.0 }
            : null;
        const modifiedDrinkItem = smallDrinkItem
            ? { ...smallDrinkItem, price: 0.99 }
            : null;

        addItemToBasket(modifiedChipsItem);
        addItemToBasket(modifiedDrinkItem);
    } else if (choice === "frenchFries") {
        const frenchFriesItem = menuItems.find((item) =>
            item.name.toLowerCase().startsWith("fries")
        );
        const smallDrinkItem = menuItems.find((item) =>
            item.name.toLowerCase().includes("drink")
        );

        const modifiedFriesItem = frenchFriesItem
            ? { ...frenchFriesItem, price: 1.0 }
            : null;
        const modifiedDrinkItem = smallDrinkItem
            ? { ...smallDrinkItem, price: 0.99 }
            : null;

        addItemToBasket(modifiedFriesItem);
        addItemToBasket(modifiedDrinkItem);
    }
};

const CashierView = ({ menuItems }) => {
    const [panel, setPanel] = useState(null);
    const [currType, setCurrType] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const {
        basket,
        addItemToBasket,
        increaseItemQuantity,
        decreaseItemQuantity,
        emptyBasket,
        placeOrder,
        RemoveItemConfirmationDialog,
    } = useBasket();

    const PopulateMenuItems = () => {
        // sorting the beef & bean burgers to group by type
        const customSort = (a, b) => {
            if (a.name.includes("beef") && !b.name.includes("beef")) return -1;
            if (!a.name.includes("beef") && b.name.includes("beef")) return 1;
            if (a.name.includes("bean") && !b.name.includes("bean")) return 1;
            if (!a.name.includes("bean") && b.name.includes("bean")) return -1;
            return 0;
        };

        let filteredItems = menuItems.filter((item) => item.type === panel);
        filteredItems.sort(customSort);

        const handleItemClick = (item) => {
            addItemToBasket(item);
        };

        return (
            <>
                {filteredItems.map((item, index) => {
                    let itemName = formatItemName(item);

                    return (
                        <Button
                            key={index}
                            variant="outlined"
                            style={{
                                flexGrow: 1,
                                borderRadius: 0,
                                color: "black",
                                backgroundColor: getItemNameColor(itemName),
                                border: "1px solid black",
                                borderLeftWidth: 0,
                                borderTopWidth: 0,
                                borderRightWidth: index % 3 === 2 ? 0 : "1px",
                            }}
                            onClick={() => handleItemClick(item)}
                            className="menu-item"
                        >
                            <img
                                src={require("../../img/temp_burger.jpeg")}
                                alt={itemName}
                            />
                            <div>{itemName}</div>
                            <div>${parseFloat(item.price).toFixed(2)}</div>
                        </Button>
                    );
                })}
            </>
        );
        // <div
        //     style={{
        //         display: "flex",
        //         flexDirection: "row",
        //         flexWrap: "wrap",
        //         backgroundColor: "white",
        //     }}
        // >
        //     {filteredItems.map((item, index) => {
        //         let itemName = formatItemName(item);

        //         return (
        //             <div key={index}>
        //                 {/* menu item buttons */}
        //                 <button
        //                     variant="outlined"
        //                     onClick={() => handleItemClick(item)}
        //                     style={{
        //                         width: "135px",
        //                         height: "135px",
        //                         margin: "8px",
        //                         fontSize: "16px",
        //                         borderRadius: 5,
        //                         backgroundColor: getItemNameColor(itemName),
        //                     }}
        //                 >
        //                     <div style={{ paddingBottom: "15px" }}>
        //                         {itemName}
        //                     </div>
        //                     ${item.price}
        //                 </button>
        //             </div>
        //         );
        //     })}
        // </div>
    };

    const handleComboDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const DisplayBasket = () => {
        // Subtotal, tax, & total
        const subtotal = basket.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const rate = 0.08;
        const tax = subtotal * rate;
        const total = subtotal + tax;

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    overflow: "auto",
                }}
            >
                <Card
                    variant="outlined"
                    sx={{ mb: 2, flex: 1, overflow: "auto" }}
                >
                    <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Order
                                </Typography>
                            </Grid>
                            {basket.map((item, index) => (
                                <Grid key={item} item xs={12} spacing={2}>
                                    <Card>
                                        <CardContent>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1">
                                                    {formatItemName(item)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid
                                                    container
                                                    alignItems="center"
                                                    justifyContent="flex-start"
                                                    spacing={1}
                                                >
                                                    <Grid item>
                                                        <IconButton size="small">
                                                            <RemoveIcon
                                                                onClick={() =>
                                                                    decreaseItemQuantity(
                                                                        item.name
                                                                    )
                                                                }
                                                                aria-label="Decrease item"
                                                            />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography>
                                                            {item.quantity}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <IconButton size="small">
                                                            <AddIcon
                                                                onClick={() =>
                                                                    increaseItemQuantity(
                                                                        item.name
                                                                    )
                                                                }
                                                                aria-label="Increase item"
                                                            />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs
                                                        style={{
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1">
                                                            $
                                                            {parseFloat(
                                                                item.price *
                                                                    item.quantity
                                                            ).toFixed(2)}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Display subtotal, tax, and total */}
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography color="textSecondary">
                                    Subtotal
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: "right" }}>
                                <Typography color="textSecondary">
                                    ${subtotal.toFixed(2)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography color="textSecondary">
                                    Tax (8%)
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: "right" }}>
                                <Typography color="textSecondary">
                                    ${tax.toFixed(2)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1">
                                    Total
                                </Typography>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: "right" }}>
                                <Typography variant="subtitle1">
                                    ${total.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={emptyBasket}
                        >
                            Clear Order
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={placeOrder}
                            disabled={basket.length === 0}
                        >
                            Place Order
                        </Button>
                    </Box>
                </Card>
            </div>
        );
    };

    const Accessibility = () => {
        const [showAccessibilityPanel, setShowAccessibilityPanel] =
            useState(false);

        return (
            <>
                <button
                    style={{
                        gridRow: 8,
                        gridColumn: 2,
                    }}
                    aria-label="accessibility options"
                    onClick={() =>
                        setShowAccessibilityPanel((prevState) => !prevState)
                    } // Adjusted to call the toggle function
                >
                    <SettingsAccessibilityIcon />
                </button>
                {showAccessibilityPanel && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: "50%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        <button
                            onClick={() =>
                                setShowAccessibilityPanel(
                                    (prevState) => !prevState
                                )
                            }
                        >
                            <CloseIcon />
                        </button>
                        <span>Accessibility Options</span>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="view">
            <div className="right-panel">{DisplayBasket()}</div>
            <div className="center-panel">
                {PopulateMenuItems()}
                {Accessibility()}
                <Button
                    variant="outlined"
                    style={{
                        backgroundColor: "#ecebed",
                        color: "black",
                        borderColor: "black",
                        gridColumn: 1,
                        gridRow: 8,
                    }}
                >
                    Order
                </Button>
                <Button
                    variant="outlined"
                    style={{
                        backgroundColor: "#ecebed",
                        color: "black",
                        borderColor: "black",
                        gridColumn: 3,
                        gridRow: 8,
                    }}
                    onClick={handleComboDialog}
                >
                    Make a Combo
                </Button>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Combos</DialogTitle>
                    <DialogContent>
                        <Button onClick={() => handleMakeCombo("kettleChips", menuItems, addItemToBasket, setOpenDialog)}>
                            Kettle Chips
                        </Button>
                        <Button onClick={() => handleMakeCombo("frenchFries", menuItems, addItemToBasket, setOpenDialog)}>
                            Fries
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <RemoveItemConfirmationDialog />
            </div>
            <div className="left-panel">
                {categories.map((category) => (
                    <CategoryButton
                        text={category}
                        panel={category}
                        setPanel={setPanel}
                        setCurrType={setCurrType}
                        currType={currType}
                    />
                ))}
            </div>
        </div>
    );
};

export { CashierView };
