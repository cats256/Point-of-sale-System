from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432)


# not standard practice to add info add the end, just have the name of the resource requested aka "/ingredients"
# API endpoint to fetch ingredients
@app.route("/ingredients_info", methods=["GET"])
def get_ingredients_info():
    cur = conn.cursor()
    query = sql.SQL("SELECT * FROM ingredients")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    ingredient_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(ingredient_info)


# API endpoint to fetch menu items
@app.route("/menu_item_info", methods=["GET"])
def get_menu_item_info():
    cur = conn.cursor()
    query = sql.SQL("SELECT * FROM menu_items")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    menu_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(menu_info)

# API endpoint to submit an order
@app.route("/submit_order", methods=["GET"])
def submit_order():
    data = request.form

    name = data.get("name")
    price = data.get("price")
    date = data.get("date")
    assigned_employee = data.get("assigned_employee")

    cur = conn.cursor()
    query = sql.SQL("INSERT INTO orders (name, price, date, assigned_employee) VALUES (%s, %s, %s, %s);")
    cur.execute(query, (name, price, date, assigned_employee))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Order submitted successfully",
        }
    )

# API endpoint to submit a restock order
@app.route("/restock_order", methods=["GET"])
def restock_order():
    data = request.form

    name = data.get("name")
    price = data.get("price")
    quantity = data.get("quantity")
    ingredient_id = data.get("ingredient_id")

    cur = conn.cursor()

    restock_query = sql.SQL("INSERT INTO restock_order (name, price, quantity, ingredient_id) VALUES (%s, %s, %s, %s);")
    cur.execute(restock_query, (name, price, quantity, ingredient_id))

    current_stock_query = sql.SQL("SELECT quantity FROM ingredients WHERE id=%s;")
    cur.execute(current_stock_query, (ingredient_id))
    current_stock_row = cur.fetchone()

    current_stock = int(current_stock_row[0])
    updated_quantity = current_stock + int(quantity)

    quantity_query = sql.SQL("UPDATE ingredients SET quantity = %s WHERE id = %s;")
    cur.execute(quantity_query, (updated_quantity, ingredient_id))

    conn.commit()
    cur.close()

    return jsonify(
        {
            "message": "Restock order submitted successfully",
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
