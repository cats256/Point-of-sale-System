import eventlet

eventlet.monkey_patch()

import os
import deepl
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
from psycopg2 import sql

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432)


# not standard practice to add info add the end, just have the name of the resource requested aka "/ingredients"
# API endpoint to fetch ingredients
@app.route("/ingredients_info", methods=["GET"])
def get_ingredients_info():
    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432
        )
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
    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432
        )
        cur = conn.cursor()
    query = sql.SQL("SELECT * FROM menu_items")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    menu_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(menu_info)


# API endpoint to fetch employees
@app.route("/employee_info", methods=["GET"])
def get_employee_info():
    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432
        )
        cur = conn.cursor()
    query = sql.SQL("SELECT * FROM employees")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    menu_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(menu_info)


# API endpoint to fetch orders
# not sure we need this
@app.route("/orders_info", methods=["GET"])
def get_orders_info():
    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432
        )
        cur = conn.cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = sql.SQL("SELECT * FROM orders o WHERE o.date >= %s AND o.date <= %s")
    cur.execute(query, (start_date, end_date))
    orders_info = cur.fetchall()
    cur.close()

    return orders_info


# API endpoint to submit an order
@app.route("/submit_order", methods=["GET"])
def submit_order():
    data = request.form

    name = data.get("name")
    price = data.get("price")
    date = data.get("date")
    assigned_employee = data.get("assigned_employee")

    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432
        )
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

    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password="nighthawk", port=5432
        )
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


deepl_auth_key = "a80c467c-4902-4f58-a2b9-a31da3e4a2f5:fx"
translator = deepl.Translator(deepl_auth_key)


@app.route("/translate", methods=["POST"])
def translate_text():
    request_json = request.json
    text = request_json["text"]
    target_lang = request_json["targetLanguage"]

    result = translator.translate_text(text, source_lang="EN", target_lang=target_lang)
    return jsonify(result.text)


@app.route("/languages", methods=["GET"])
def get_languages():
    languages = {}
    for lang in translator.get_target_languages():
        languages[lang.name] = lang.code
    return jsonify(languages)


if __name__ == "__main__":
    env = os.getenv("FLASK_ENV", "development")
    if env == "production":
        app.run(debug=False, host="0.0.0.0")
    else:
        app.run(debug=True)
