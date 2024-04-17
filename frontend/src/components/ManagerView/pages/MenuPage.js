import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { getMenuItems } from "../../../network/api";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [newItemId, setNewItemId] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch menu items from API
    async function fetchMenuItems() {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }

    fetchMenuItems();
  }, []);

  const handleMenuItemClick = (index) => {
    setSelectedMenuItem(index);
    setEditId(menuItems[index].id);
    setEditName(menuItems[index].name);
    setEditPrice(menuItems[index].price);
  };

  const handleEditMenuItem = () => {
    if (selectedMenuItem !== null) {
      const updatedMenuItems = [...menuItems];
      updatedMenuItems[selectedMenuItem] = {
        id: editId,
        name: editName,
        price: editPrice,
      };
      setMenuItems(updatedMenuItems);
    }
  };

  const handleAddMenuItem = () => {
    const newItem = {
      id: newItemId || 0,
      name: newItemName || "New Item",
      price: newItemPrice || 0,
    };
    setMenuItems([...menuItems, newItem]);
    setSelectedMenuItem(menuItems.length);
    setEditName("");
    setEditPrice("");
    setNewItemId("");
    setNewItemName("");
    setNewItemPrice("");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%", padding: "20px" }}>
        <Typography variant="h6">Menu Items</Typography>
        <TextField
          label="Search"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          style={{ marginBottom: "20px" }}
        />
        <div style={{ marginTop: "20px" }}>
          {filteredMenuItems.map((item, index) => (
            <div
              key={index}
              style={{
                cursor: "pointer",
                padding: "8px",
                backgroundColor:
                  index === selectedMenuItem ? "#f0f0f0" : "transparent",
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
        <Button
          variant="contained"
          onClick={handleAddMenuItem}
          style={{ marginBottom: "20px" }}
        >
          Add
        </Button>
        <Typography variant="h6">
          {selectedMenuItem !== null ? "Edit Menu Item" : "Edit Menu Item"}
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
      </div>
    </div>
  );
};

export default MenuPage;
