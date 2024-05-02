/**
 * Represents a component for managing menu items.
 * Allows users to view, search, add, edit, and delete menu items.
 * @module MenuPage
 */

import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import {
    editMenuItems,
    getMenuItems,
    addMenuItem,
    getMenuItemTypes,
    deleteMenuItems,
} from "../../../network/api";

/**
 * A React component for managing menu items.
 * @returns {JSX.Element} The rendered component.
 */
const MenuPage = () => {
    // State hooks for managing component data
    const [menuItems, setMenuItems] = useState([]);
    const [menuItemTypes, setMenuItemTypes] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [newItemType, setNewItemType] = useState("");

    useEffect(() => {
        // Fetch menu items and types from API
        async function fetchData() {
            try {
                const items = await getMenuItems();
                setMenuItems(items);

                const types = await getMenuItemTypes();
                const typesList = types.map((type) => type.type);
                setMenuItemTypes(typesList);
                if (typesList.length > 0) {
                    setNewItemType(typesList[0]); // Set initial value for newItemType
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    /**
     * Handles the click event on a menu item.
     * Sets the selected menu item and updates the edit fields.
     * @param {number} index - The index of the selected menu item.
     */
    const handleMenuItemClick = (index) => {
        setSelectedMenuItem(index);
        const selectedItem = menuItems[index];
        setEditName(selectedItem.name);
        setEditPrice(selectedItem.price);
    };

    const handleEditMenuItem = () => {
        if (selectedMenuItem !== null) {
            const editData = {
                id: selectedMenuItem,
                name: editName,
                price: editPrice,
            };
            editMenuItems(editData)
                .then(() => {
                    console.log("ran");
                    const updatedMenuItems = [...menuItems]; // Create a copy of menuItems array
                    updatedMenuItems[selectedMenuItem] = {
                        // Update the selected menu item
                        ...updatedMenuItems[selectedMenuItem],
                        price: editPrice,
                        name: editName,
                    };
                    setMenuItems(updatedMenuItems);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    // Handle error if needed
                });
        }
    };

    const handleAddMenuItem = () => {
        const newItem = {
            id: menuItems.length,
            name: newItemName || "New Item",
            price: newItemPrice || 0,
            type: newItemType || 0,
        };
        setMenuItems([...menuItems, newItem]);
        setSelectedMenuItem(menuItems.length);
        setEditName("");
        setEditPrice("");
        console.log(newItemType);
        // setNewItemId("");
        setNewItemName("");
        setNewItemPrice("");
        addMenuItem(newItem);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredMenuItems = menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteMenuItem = () => {
        if (selectedMenuItem !== null) {
            // Call API to delete menu item
            deleteMenuItems(selectedMenuItem)
                .then(() => {
                    // Filter out the deleted item from menuItems
                    const updatedMenuItems = menuItems.filter(
                        (item) => item.id !== selectedMenuItem
                    );
                    setMenuItems(updatedMenuItems);
                    // Reset selection after deletion
                    setSelectedMenuItem(null);
                })
                .catch((error) => {
                    console.error("Error deleting menu item:", error);
                    // Handle error if needed
                });
        }
    };

    return (
        <div style={{ marginLeft: "15%", display: "flex" }}>
            <div style={{ width: "50%", padding: "20px" }}>
                <Typography variant="h6">Menu Items</Typography>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <div
                    style={{
                        marginTop: "20px",
                        height: "80vh",
                        overflowY: "auto",
                    }}
                >
                    {filteredMenuItems.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                cursor: "pointer",
                                padding: "8px",
                                backgroundColor:
                                    index === selectedMenuItem
                                        ? "#f0f0f0"
                                        : "transparent",
                            }}
                            onClick={() => handleMenuItemClick(item.id)}
                        >
                            {item.name} - ${item.price}
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
                <Typography variant="h6">Add Menu Item</Typography>
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
                    label="Type"
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                >
                    {menuItemTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    onClick={handleAddMenuItem}
                    style={{ marginBottom: "20px" }}
                >
                    Add
                </Button>
                <Typography variant="h6">
                    {selectedMenuItem !== null
                        ? "Edit Menu Item"
                        : "Edit Menu Item"}
                </Typography>
                <TextField
                    label="Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <TextField
                    label="Price"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    fullWidth
                    style={{ marginBottom: "20px" }}
                />
                <Button
                    variant="contained"
                    onClick={handleEditMenuItem}
                    disabled={selectedMenuItem === null}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    onClick={handleDeleteMenuItem}
                    disabled={selectedMenuItem === null}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default MenuPage;
