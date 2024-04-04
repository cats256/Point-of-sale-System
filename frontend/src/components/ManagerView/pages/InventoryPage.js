// InventoryPage.js
import React, { useState, useEffect } from 'react';
import { getIngredients, submitRestockOrder } from '../../../network/api';
//import Inventory from '../components/Inventory';

const InventoryPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    ingredient_id: ''
  });

  useEffect(() => {
    getIngredients()
    .then(data => setIngredients(data));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    // Calculate price if quantity changes
    if (id === 'quantity') {
      const ingredient = ingredients.find(ingredient => ingredient.id === formData.ingredient_id);
      const price = ingredient ? ingredient.price * value : '';
      setFormData(prevState => ({
        ...prevState,
        [id]: value,
        price: price
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [id]: value
      }));
    }
  };
  

  const handleIngredientClick = (ingredient) => {
    setFormData({
      name: ingredient.name,
      ingredient_id: ingredient.id,
      quantity: formData.quantity,
      price: ingredient.price * formData.quantity
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRestockOrder(formData)
    .then(data => {
      alert("success")
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  

  return (
    <div>
      <h1>Inventory Page</h1>
      {ingredients.map(ingredient => (
          <button key={ingredient.id} onClick={() => handleIngredientClick(ingredient)}>
          {ingredient.name}
        </button>
        ))}
      <form onSubmit={handleSubmit} method='POST'>
        <input id='name' placeholder='name' value={formData.name} readOnly></input>
        <input id='quantity' placeholder='quantity' value={formData.quantity} onChange={handleChange}></input>
        <input id='price' placeholder='price' value={formData.price} readOnly></input>
        <input id='ingredient_id' placeholder='ingredient_id' value={formData.ingredient_id} readOnly></input>
        <button id='submit_restock'>Submit</button>
      </form>
    </div>
  );
};

export default InventoryPage;