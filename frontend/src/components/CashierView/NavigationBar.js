import React from "react";

/**
 * Represents a navigation bar component.
 *
 * @param {Array} categories - An array of categories to be displayed in the navigation bar.
 * @param {Function} handleCategoryClick - A function to handle category clicks.
 * @returns {JSX.Element} NavigationBar component JSX.
 */
const NavigationBar = ({ categories, handleCategoryClick }) => {
    return (
        <div className="left-nav-bar">
            <h2>Categories</h2>
            <div>
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NavigationBar;
