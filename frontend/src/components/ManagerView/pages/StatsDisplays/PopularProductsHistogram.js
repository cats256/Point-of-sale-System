// PopularProductsHistogram.js
import React, { useState, useEffect } from "react";

const PopularProductsHistogram = ({ date }) => {
    const [popularProductsData, setPopularProductsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/popular_products?date=${date.toISOString()}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setPopularProductsData(data);
            } catch (error) {
                console.error("Error fetching popular products data:", error);
            }
        };

        fetchData();
    }, [date]);

    return (
        <div>
            {/* Render your histogram component using popularProductsData */}
            <p>Histogram Placeholder - Most Popular Products</p>
        </div>
    );
};

export default PopularProductsHistogram;
