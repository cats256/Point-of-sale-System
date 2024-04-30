import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import { editMenuItems, getMenuItems, addMenuItem, getMenuItemTypes, deleteMenuItems  } from "../../../network/api";

// const types = ["Burger", "Sandwich", "Dessert"]; // List of types

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemTypes, setMenuItemTypes] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
//   const [newItemId, setNewItemId] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemType, setNewItemType] = useState("");

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

    async function fetchMenuItemTypes() {
        try {
          const types = await getMenuItemTypes();
          const types_list = [];
          for (let i = 0; i < types.length; i++){
            types_list.push(types[i]["type"]);
          }
          setMenuItemTypes(types_list);
          if (types_list.length > 0) {
            setNewItemType(types_list[0]); // Set initial value for newItemType
          }
          console.log(types);
        } catch (error) {
          console.error("Error fetching menu item types:", error);
        }
    }
    fetchMenuItemTypes();    
  }, []);

  const handleMenuItemClick = (index) => {
    setSelectedMenuItem(index);
    console.log(menuItems[index]);
    console.log(menuItems);
    setEditName(menuItems[index].name);
    setEditPrice(menuItems[index].price);
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
                updatedMenuItems[selectedMenuItem] = { // Update the selected menu item
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
