import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import { editMenuItems, getMenuItems, addMenuItem, getMenuItemTypes, deleteMenuItems, getHighestMenuItemId  } from "../../../network/api";

// const types = ["Burger", "Sandwich", "Dessert"]; // List of types

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemTypes, setMenuItemTypes] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
//   const [newItemId, setNewItemId] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemType, setNewItemType] = useState("");
  const [customItemType, setCustomItemType] = useState("");

  async function fetchMenuItems() {
    try {
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  }

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

  useEffect(() => {
    // Fetch menu items from API
    fetchMenuItems();
    fetchMenuItemTypes();    
  }, []);

  const handleMenuItemClick = (index) => {
    setSelectedMenuItemIndex(index);
    setSelectedMenuItem(menuItems[index]["id"]);
    console.log(menuItems[index]["id"]);
    console.log(menuItems);
    setEditName(menuItems[index]["name"]);
    setEditPrice(menuItems[index]["price"]);
  };

  const handleEditMenuItem = () => {
    if (selectedMenuItem !== null) {
        console.log(selectedMenuItem);
        const editData = {
            id: selectedMenuItem,
            name: editName,
            price: editPrice,
        };
        editMenuItems(editData)
            .then(() => {
                console.log("ran");
                const updatedMenuItems = [...menuItems]; // Create a copy of menuItems array
                updatedMenuItems[selectedMenuItemIndex] = { // Update the selected menu item
                ...updatedMenuItems[selectedMenuItemIndex],
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

  const handleAddMenuItem = async () => {
    const newMenuItemIdAwait = await getHighestMenuItemId();
    const newMenuItemId = parseInt(newMenuItemIdAwait.highest_id) +1;
    const newItem = {
      id: newMenuItemId,
      name: newItemName || "New Item",
      price: newItemPrice || 0,
      type: customItemType || newItemType,
    };
    setEditName("");
    setEditPrice("");
    addMenuItem(newItem)
      .then(() => {
        setMenuItems([...menuItems, newItem]);
        if (customItemType){
          setMenuItemTypes([...menuItemTypes, customItemType])
        }
        setSelectedMenuItem(newMenuItemId);
        setSelectedMenuItemIndex(menuItems.length-1);
        setNewItemName("");
        setNewItemPrice("");
        setCustomItemType(""); // Reset customItemType after adding
      })
      .catch(error => {
        console.error("Error adding menu item:", error);
      });
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
      console.log(selectedMenuItem);
      console.log(menuItems);
      const deleted_item = {
        id: selectedMenuItem,
    };
      deleteMenuItems(deleted_item)
        .then(async () => {
          // Filter out the deleted item from menuItems
          // const updatedMenuItems = menuItems.filter(
          //   (item) => item.id !== selectedMenuItem
          // );
          const updatedMenuItems = await getMenuItems();
          setMenuItems(updatedMenuItems);
          // fetchMenuItems();
          // fetchMenuItemTypes();
          // Reset selection after deletion
          setSelectedMenuItem(null);
          setEditName("");
          setEditPrice("");
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
        <div style={{ marginTop: "20px", height: "80vh", overflowY: "auto" }}>
          {filteredMenuItems.map((item, index) => (
            <div
              key={index}
              style={{
                cursor: "pointer",
                padding: "8px",
                backgroundColor:
                  index === selectedMenuItem ? "#f0f0f0" : "transparent",
              }}
              onClick={() => handleMenuItemClick(index)}
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
            <MenuItem key="createNew" value="createNew">
              Create New Type
            </MenuItem>
        </TextField>
        {newItemType === "createNew" && (
          <TextField
            label="Custom Type"
            value={customItemType}
            onChange={e => setCustomItemType(e.target.value)}
            fullWidth
            style={{ marginBottom: "20px" }}
          />
        )}
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
