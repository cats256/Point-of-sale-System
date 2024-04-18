import axios from "axios";
import { ConflictError, UnauthorizedError } from "./errors.js";

const API_BASE =
    process.env.NODE_ENV === "production"
        ? "https://project-3-315-flask.onrender.com"
        : "http://127.0.0.1:5000";

async function handleResponse(response) {
    const contentType = response.headers.get("content-type");

    if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
            const json = await response.json();
            return json;
        } else if (contentType && contentType.includes("text/html")) {
            return response.text();
        } else if (!contentType || response.status === 204) {
            return null;
        } else {
            return response.text();
        }
    } else {
        let errorMessage;
        if (contentType && contentType.includes("application/json")) {
            const errorBody = await response.json();
            errorMessage = errorBody.error || "Unknown error";
        } else {
            errorMessage = `Request failed with status: ${response.status}`;
        }
        switch (response.status) {
            case 401:
                throw new UnauthorizedError(errorMessage);
            case 409:
                throw new ConflictError(errorMessage);
            default:
                throw new Error(errorMessage);
        }
    }
}

export async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    return handleResponse(response);
}

export async function getMenuItems() {
    return request("/menu_item_info", { method: "GET" });
}

export async function getIngredients() {
    return request("/ingredients_info", { method: "GET" });
}

export async function getLanguages() {
    return request("/languages", { method: "GET" });
}

export async function getOrders(start_date, end_date) {
    const response = await axios.get(`${API_BASE}/orders_info`, {
        params: {
            start_date,
            end_date,
        },
    });

    return response.data;
}

export async function getEmployees() {
    return request("/employee_info", { method: "GET" });
}

export async function translate(text, targetLanguage) {
    return request(`/translate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, targetLanguage }),
    });
}

export async function updateSalary(formData) {
    return request("/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
}

export async function editMenuItems(formData) {
    return request("/menu_item_edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
}

export async function submitOrder(formData) {
    return request("/submit_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
}

export async function submitRestockOrder(formData) {
    return request("/restock_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
}

export async function getOrderId() {
    return request("/order_id", { method: "GET" });
}

export async function getItemId(menuItemName) {
    const response = await request(
        `/menu_item_id?name=${encodeURIComponent(menuItemName)}`,
        { method: "GET" }
    );
    return response; // Return the entire response object
}

export async function attachMenuItem(formData) {
    return request("/attach_menu_items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
}

export async function getTopTen() {
    return request("/top_ten", { method: "GET" });
}

export async function getItemName(menuItemID) {
    const response = await request(
        `/menu_item_name?id=${encodeURIComponent(menuItemID)}`,
        { method: "GET" }
    );
    return response;
}
