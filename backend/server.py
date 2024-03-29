from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import sql

app = Flask(__name__)

conn = psycopg2.connect(
    host='csce-315-db.engr.tamu.edu',
    user='csce315_902_03_user',
    dbname='csce315_902_03_db',
    password='nighthawk',
    port=5432
)

# API endpoint to fetch ingredients 
@app.route("/ingredients_info", methods=["GET"])
def get_ingredients_info():
    cur = conn.cursor()
    query = sql.SQL("SELECT * FROM ingredients")
    cur.execute(query)
    ingredient_info = cur.fetchall()
    cur.close()
    return jsonify({
        "ingredients": ingredient_info,
    })

# API endpoint to fetch menu items
@app.route("/menu_item_info", methods=["GET"])
def get_menu_item_info():
    cur = conn.cursor()
    query = sql.SQL("SELECT * FROM menu_items")
    cur.execute(query)
    menu_item_info = cur.fetchall()
    cur.close()
    return jsonify({
        "menu items": menu_item_info,
    })

# API endpoint to fetch orders
# not sure we need this 
@app.route("/orders_info", methods=["GET"])
def get_orders_info():
    cur = conn.cursor()

    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = sql.SQL("SELECT * FROM orders o WHERE o.date >= %s AND o.date <= %s")
    cur.execute(query, (start_date, end_date))
    orders_info = cur.fetchall()
    cur.close()

    return jsonify({
        "orders": orders_info,
    })

# API endpoint to submit an order
# need to work on this
@app.route("/orders_info", methods=["GET"])
def submit_order():
    data = request.json 
    
    id = data.get('id')
    name = data.get('name')
    price = data.get('price')
    date = data.get('date')
    assigned_employee = data.get('assigned_employee')

    cur = conn.cursor()
    query = sql.SQL("INSERT INTO orders (name, price, date, assigned_employee) VALUES (%s, %s, %s, %s, %s);")
    cur.execute(query, (id, name, price, date, assigned_employee))
    con.commit()
    cur.close()
    return jsonify({
        "message": "Order submitted successfully",
    })


if __name__ == "__main__":
    app.run(debug=True)
