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
      getIngredients()
      .then(ingredientsData => setIngredients(ingredientsData));
      alert("Success! Your " + formData.name + " restock order cost $" + formData.price + ".")
    })
    .catch(error => {
      console.error('Error:', error);
    });
    setFormData({
      name: "",
      quantity: "",
      price: "",
      ingredient_id: ""
    });
    getIngredients();
  };

  return (
    <div>
      <h1>Inventory Page</h1>
      <h2>Ingredient Restock</h2>
      <form onSubmit={handleSubmit} method='POST'>
        <input id='name' placeholder="ingredient" value={formData.name} readOnly></input>
        <input id='quantity' placeholder="quantity to order" value={formData.quantity} onChange={handleChange}></input>
        <input id='price' value={"$" + formData.price} readOnly></input>
        <input id='ingredient_id' value={"ingredient id: " + formData.ingredient_id} readOnly></input>
        <button id='submit_restock'>Submit</button>
      </form>
      <h2>Ingredients Table</h2>
      <table>
        <thead>
          <tr>
            <th>Ingredient Name</th>
            <th>Quantity</th>
            <th>Restock</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{ingredient.quantity}</td>
              <td>
                <button onClick={() => handleIngredientClick(ingredient)}
                style={{ backgroundColor: ingredient.quantity < 1005 ? 'red' : '' }}>
                  Restock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;