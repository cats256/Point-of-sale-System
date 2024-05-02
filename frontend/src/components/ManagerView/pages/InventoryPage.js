import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import {
    submitRestockOrder,
    getIngredients,
    addIngredient,
    getSuppliers,
} from "../../../network/api";

/**
 * Represents a component for managing inventory.
 * @module InventoryPage
 */
const InventoryPage = () => {
    /**
     * State variables for managing ingredient data.
     */
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [restockName, setRestockName] = useState("");
    const [restockPrice, setRestockPrice] = useState("");
    const [restockQuantity, setRestockQuantity] = useState("");
    const [newSupplier, setNewSupplier] = useState("");
    const [suppliers, setSuppliers] = useState([]);

    /**
     * Fetches ingredients and suppliers data on component mount.
     */
    useEffect(() => {
        async function fetchIngredients() {
            try {
                const ingredients = await getIngredients();
                setIngredients(ingredients);
            } catch (error) {
                console.error("Error fetching ingredient list:", error);
            }
        }
        fetchIngredients();

        async function fetchSuppliers() {
            try {
                const suppliers = await getSuppliers();
                const suppliersList = suppliers.map(
                    (supplier) => supplier.supplier
                );
                setSuppliers(suppliersList);
                if (suppliersList.length > 0) {
                    setNewSupplier(suppliersList[0]);
                }
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        }
        fetchSuppliers();
    }, []);

    /**
     * Handles the click event for selecting an ingredient.
     * @param {number} ingredientId - The ID of the selected ingredient.
     */
    const handleIngredientClick = (ingredientId) => {
        const ingredientIndex = ingredients.findIndex(
            (ingredient) => ingredient.id === ingredientId
        );

        if (ingredientIndex !== -1) {
            setSelectedIngredient(ingredientId);

            setRestockName(ingredients[ingredientIndex].name);
            setRestockPrice(ingredients[ingredientIndex].price);
        }
    };

    /**
     * Handles the restocking of an ingredient.
     */
    const handleRestockIngredient = () => {
        if (selectedIngredient !== null) {
            const restockData = {
                name: restockName,
                price: restockPrice * restockQuantity,
                quantity: restockQuantity,
                ingredient_id: selectedIngredient,
            };

            submitRestockOrder(restockData)
                .then(() => {
                    alert(
                        "Your restock order was successful. Total cost: $" +
                            restockData.price
                    );
                    const updatedIngredients = [...ingredients];
                    const ingredientIndex = updatedIngredients.findIndex(
                        (ingredient) => ingredient.id === selectedIngredient
                    );
                    updatedIngredients[ingredientIndex].quantity +=
                        parseInt(restockQuantity);
                    setIngredients(updatedIngredients);
                    setRestockName("");
                    setRestockQuantity("");
                    setRestockPrice("");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    /**
     * Handles the addition of a new ingredient.
     */
    const handleAddIngredient = () => {
        const newItem = {
            name: newItemName || "New Item",
            price: newItemPrice || 0,
            quantity: 0,
        };
        setIngredients([...ingredients, newItem]);
        setSelectedIngredient(ingredients.length);
        setNewItemName("");
        setNewItemPrice("");
        addIngredient(newItem);
    };

    /**
     * Handles the search query input change event.
     * @param {Object} e - The event object.
     */
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    /**
     * Filters the ingredients based on the search query.
     */
    const filteredIngredients = ingredients.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ marginLeft: "15%", display: "flex" }}>
            <div style={{ width: "50%", padding: "20px" }}>
                <Typography variant="h6">Ingredients</Typography>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <Typography variant="h6">Inventory Stock</Typography>
                <div
                    style={{
                        marginTop: "20px",
                        height: "80vh",
                        overflowY: "auto",
                    }}
                >
                    {filteredIngredients.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                cursor: "pointer",
                                padding: "8px",
                                backgroundColor:
                                    index === selectedIngredient
                                        ? "#f0f0f0"
                                        : "transparent",
                                color: item.quantity < 1005 ? "red" : "inherit",
                            }}
                            onClick={() => handleIngredientClick(item.id)}
                        >
                            {item.name}: {item.quantity}
                        </div>
                    ))}
                </div>
            </div>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "40%",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            >
                <Typography variant="h6">Add Ingredient</Typography>
                <TextField
                    label="Name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <TextField
                    label="Price"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <TextField
                    select
                    label="Supplier"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                >
                    {suppliers.map((supplier) => (
                        <MenuItem key={supplier} value={supplier}>
                            {supplier}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    onClick={handleAddIngredient}
                    style={{ marginBottom: "20px" }}
                >
                    Add
                </Button>
                <Typography variant="h6">Restock Ingredient</Typography>
                <TextField
                    label="Name"
                    value={restockName}
                    onChange={(e) => setRestockName(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <TextField
                    label="Quantity"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <TextField
                    label="Unit Price"
                    value={restockPrice}
                    onChange={(e) => setRestockPrice(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <Button
                    variant="contained"
                    onClick={handleRestockIngredient}
                    disabled={selectedIngredient === null}
                >
                    Restock
                </Button>
            </div>
        </div>
    );
};

export default InventoryPage;
