// InventoryPage.js
import React, { useState, useEffect } from 'react';
import { getIngredients } from '../../../network/api';
//import Inventory from '../components/Inventory';

const InventoryPage = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    getIngredients()
    .then(data => setIngredients(data));
  }, []);

  return (
    <div>
      <h1>Inventory Page</h1>
      {ingredients.map(ingredient => (
          <button key={ingredient.id}>{ingredient.name}</button>
        ))}
    </div>
  );
};

export default InventoryPage;