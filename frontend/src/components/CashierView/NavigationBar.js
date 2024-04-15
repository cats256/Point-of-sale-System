import React from "react";

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
