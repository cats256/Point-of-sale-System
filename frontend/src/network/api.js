const API_BASE = "http://127.0.0.1:5000/";

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
        // TODO: fix error checking for failed api calls
        // switch (response.status) {
        //     case 401:
        //         throw new UnauthorizedError(errorMessage);
        //     case 409:
        //         throw new ConflictError(errorMessage);
        //     default:
        //         throw new Error(errorMessage);
        // }
        throw new Error(errorMessage);
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

export async function submitRestockOrder(formData) {
    return request("/restock_order", { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify(formData) });
}