import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import { submitRestockOrder, getIngredients, addIngredient, getSuppliers, editIngredient, deleteIngredient  } from "../../../network/api";

const InventoryPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [restockName, setRestockName] = useState('');
  const [restockPrice, setRestockPrice] = useState('');
  const [restockQuantity, setRestockQuantity] = useState('');
  const [newSupplier, setNewSupplier] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSupplier, setEditSupplier] = useState("");

  async function fetchIngredients() {
    try {
      const ingredients = await getIngredients();
      setIngredients(ingredients);
    } catch (error) {
      console.error("Error fetching ingredient list:", error);
    }
  }

  useEffect(() => {
    fetchIngredients();  
    
    async function fetchSuppliers() {
      try {
        const suppliers = await getSuppliers();
        const suppliers_list = [];
        for (let i = 0; i < suppliers.length; i++){
          suppliers_list.push(suppliers[i]["supplier"]);
        }
        setSuppliers(suppliers_list);
        if (suppliers_list.length > 0) {
          setNewSupplier(suppliers_list[0]); 
        }
      } catch (error) {
        console.error("Error fetching menu item types:", error);
      }
  }
  fetchSuppliers(); 
  }, []);

  const handleIngredientClick = (ingredientId) => {
    const ingredientIndex = ingredients.findIndex(ingredient => ingredient.id === ingredientId);
    
    if (ingredientIndex !== -1) {
      setSelectedIngredient(ingredientId);

      setRestockName(ingredients[ingredientIndex].name);
      setRestockPrice(ingredients[ingredientIndex].price );
      setEditName(ingredients[ingredientIndex].name);
      setEditPrice(ingredients[ingredientIndex].price );
      setEditSupplier(ingredients[ingredientIndex].supplier);
    }
  };

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
          alert("Your restock order was successful. Total cost: $" + restockData.price);
          const updatedIngredients = [...ingredients];
          const ingredientIndex = updatedIngredients.findIndex(ingredient => ingredient.id === selectedIngredient);
          updatedIngredients[ingredientIndex].quantity += parseInt(restockQuantity);
          setIngredients(updatedIngredients); 
          setRestockName('');
          setRestockQuantity('');
          setRestockPrice('');
          setEditName('');
          setEditPrice('');
          setEditSupplier('');
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleAddIngredient = () => {
    const newItem = {
      name: newItemName || "New Item",
      price: newItemPrice || 0,
      quantity: 0,
    };
    const updatedIngredients = [...ingredients, newItem];
    setSelectedIngredient(ingredients.length);
    setNewItemName("");
    setNewItemPrice("");
    addIngredient(newItem);
    setIngredients(updatedIngredients);

  };

  const handleEditIngredient = () => {
    if (selectedIngredient !== null) {
        const editData = {
            id: selectedIngredient,
            name: editName,
            price: editPrice,
            supplier: editSupplier,
        };
        editIngredient(editData)
            .then(() => {
                const updatedIngredients = [...ingredients]; // Create a copy of menuItems array
                updatedIngredients[selectedIngredient] = { // Update the selected menu item
                ...updatedIngredients[selectedIngredient],
                price: editPrice,
                name: editName,
                supplier: editSupplier,
                };
                setEditName('');
                setEditPrice('');
                setEditSupplier('');
                setRestockName('');
                setRestockQuantity('');
                setRestockPrice('');
                fetchIngredients();
            })
            .catch((error) => {
                console.error("Error:", error);
                // Handle error if needed
            });
    }
  };

  const handleDeleteIngredient = () => {
    if (selectedIngredient !== null) {

      deleteIngredient(selectedIngredient)
        .then(() => {
          const updatedIngredients = ingredients.filter(
            (item) => item.id !== selectedIngredient
          );
          setIngredients(updatedIngredients);
          // Reset selection after deletion
          setSelectedIngredient(null);
          setEditName('');
          setEditPrice('');
          setEditSupplier('');
          setRestockName('');
          setRestockQuantity('');
          setRestockPrice('');
        })
        .catch((error) => {
          console.error("Error deleting ingredient:", error);
          // Handle error if needed
        });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredIngredients = ingredients.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ marginLeft: "15%", display: "flex", overflow: "auto" }}>
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
        <div style={{ marginTop: "20px", height: "80vh" }}>
          {filteredIngredients.map((item, index) => (
            <div
              key={index}
              style={{
                cursor: "pointer",
                padding: "8px",
                backgroundColor:
                  index === selectedIngredient ? "#f0f0f0" : "transparent",
                  color: item.quantity < 1005 ? "red" : "inherit",
              }}
              onClick={() => handleIngredientClick(item.id)}
            >
              {item.name}: {item.quantity} 
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: "40%", padding: "20px", marginLeft: "10%" }}>
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
        <Typography variant="h6">
          {selectedIngredient !== null ? "Edit Ingredient" : "Edit Ingredient"}
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
        <TextField
            select
            label="Supplier"
            value={editSupplier}
            onChange={(e) => setEditSupplier(e.target.value)}
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
          onClick={handleEditIngredient}
          disabled={selectedIngredient === null}
        >
          Edit
        </Button>
        <Button
        variant="contained"
        onClick={handleDeleteIngredient}
        disabled={selectedIngredient === null}
        >
          Delete
        </Button>
         <Typography variant="h6">
          {selectedIngredient !== null ? "Restock Ingredient" : "Restock Ingredient"}
        </Typography>
        <TextField
          label="Name"
          value={restockName}
          onChange={(e) => setRestockName(e.target.value)}
          fullWidth
          InputProps={{ readOnly: true }}
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
          InputProps={{ readOnly: true }}
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
