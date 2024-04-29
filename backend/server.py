# import eventlet

# eventlet.monkey_patch()

import os
import deepl
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
from psycopg2 import sql
from dotenv import load_dotenv
import select
import psycopg2.extensions

load_dotenv()
database_password = os.getenv("DATABASE_PASSWORD")

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password=database_password, port=5432
)


def get_cursor():
    global conn
    try:
        cur = conn.cursor()
        return cur
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password=database_password, port=5432
        )
        cur = conn.cursor()
        return cur


# not standard practice to add info add the end, just have the name of the resource requested aka "/ingredients"
# API endpoint to fetch ingredients
@app.route("/ingredients_info", methods=["GET"])
def get_ingredients_info():
    cur = get_cursor()
    query = sql.SQL("SELECT * FROM ingredients ORDER BY name ASC")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    ingredient_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(ingredient_info)


# API endpoint to fetch menu items
@app.route("/menu_item_info", methods=["GET"])
def get_menu_item_info():
    cur = get_cursor()
    query = sql.SQL("SELECT * FROM menu_items ORDER BY id ASC")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    menu_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(menu_info)


# API endpoint to fetch ordered menu items
@app.route("/order_menu_item_info", methods=["GET"])
def get_order_menu_item_info():
    cur = get_cursor()
    start_id = request.args.get("start_id")
    finish_id = request.args.get("finsih_id")
    query = sql.SQL(
        """
        SELECT menu_item_id, COUNT(*) AS category_count 
        FROM order_menu_items 
        WHERE order_id BETWEEN %s AND %s 
        GROUP BY menu_item_id 
        ORDER BY menu_item_id ASC
    """
    )

    cur.execute(query, (start_id, finish_id))
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    menu_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(menu_info)


# API endpoint to fetch menu items
@app.route("/menu_item_types", methods=["GET"])
def get_menu_item_types():
    cur = get_cursor()
    query = sql.SQL("SELECT DISTINCT type FROM menu_items")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    menu_item_types = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(menu_item_types)

# API endpoint to fetch suppliers
@app.route("/suppliers", methods=["GET"])
def get_suppliers():
    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password=database_password, port=5432
        )
        cur = conn.cursor()
    query = sql.SQL("SELECT DISTINCT supplier FROM ingredients")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    suppliers = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(suppliers)


# API endpoint to fetch menu items
@app.route("/restock_info", methods=["GET"])
def get_restock_info():
    cur = get_cursor()
    query = sql.SQL("SELECT * FROM restock_order")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    restock_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(restock_info)


@app.route("/order_menu_item", methods=["GET"])
def get_order_menu_item():
    cur = get_cursor()
    query = sql.SQL("SELECT menu_item_id, COUNT(*) AS category_count FROM order_menu_items GROUP BY menu_item_id ORDER BY menu_item_id ASC")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    order_menu_items_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(order_menu_items_info)


@app.route("/order_menu_item_from_id", methods=["GET"])
def get_order_menu_item_from_id():
    start_id = request.args.get("start_id")
    end_id = request.args.get("end_id")

    cur = get_cursor()
    query = sql.SQL(
        "SELECT menu_item_id, COUNT(*) AS category_count FROM order_menu_items WHERE order_id BETWEEN %s AND %s GROUP BY menu_item_id ORDER BY menu_item_id ASC"
    )
    cur.execute(query, (start_id, end_id))
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    order_menu_items_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(order_menu_items_info)


@app.route("/orders_ids", methods=["GET"])
def get_orders_ids():
    cur = get_cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = sql.SQL("SELECT id FROM orders o WHERE o.date >= %s AND o.date <= %s")
    cur.execute(query, (start_date, end_date))
    orders_info = cur.fetchall()
    cur.close()

    return orders_info


# API endpoint to fetch employees
@app.route("/employee_info", methods=["GET"])
def get_employee_info():
    cur = get_cursor()
    query = sql.SQL("SELECT * FROM employees ORDER BY name ASC")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    menu_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(menu_info)

# API endpoint to add a new ingredient
@app.route("/add_employee", methods=["POST"])
def add_employee():
    data = request.json

    id = data.get("id")
    name = data.get("name")
    salary = data.get("salary")
    email = data.get("email")
    manager = data.get("manager")
    password = "password"

    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password=database_password, port=5432
        )
        cur = conn.cursor()

    query = sql.SQL("INSERT INTO employees (id, name, salary, sales, email, password, manager) VALUES (%s, %s, %s, 0, %s, %s, %s);")
    cur.execute(query, (id, name, salary, email, password, manager))

    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Employee added successfully",
        }
    )

@app.route("/delete_employee", methods=["POST"])
def delete_employee():
    data = request.json

    id = data.get("id")

    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password=database_password, port=5432
        )
        cur = conn.cursor()

    query = sql.SQL("DELETE FROM employees WHERE id = %s;")
    cur.execute(query, (id,))

    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Employee deleted successfully",
        }
    )

# API endpoint to fetch orders
# not sure we need this
@app.route("/orders_info", methods=["GET"])
def get_orders_info():
    cur = get_cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = sql.SQL("SELECT * FROM orders o WHERE o.date >= %s AND o.date <= %s")
    cur.execute(query, (start_date, end_date))
    orders_info = cur.fetchall()
    cur.close()

    return orders_info


# API endpoint to return order id
@app.route("/order_id", methods=["GET"])
def order_id():
    cur = get_cursor()
    query = sql.SQL("SELECT id FROM orders WHERE id=(SELECT max(id) FROM orders);")
    cur.execute(query)
    order_id = cur.fetchone()[0]
    cur.close()
    return jsonify({"order_id": order_id})


@app.route("/menu_item_id", methods=["GET"])
def menu_item_id():
    item_name = request.args.get("name")

    cur = get_cursor()
    query = sql.SQL("SELECT id FROM menu_items WHERE name=%s;")
    cur.execute(query, (item_name,))
    item_id = cur.fetchone()[0]
    cur.close()
    return jsonify({"item_id": item_id})


@app.route("/menu_item_name", methods=["GET"])
def menu_item_name():
    item_id = request.args.get("id")

    cur = get_cursor()
    query = sql.SQL("SELECT name FROM menu_items WHERE id=%s;")
    cur.execute(query, (item_id,))
    item_name = cur.fetchone()[0]
    cur.close()
    return jsonify({"item_id": item_name})


# API endpoint for ingredient usage report
@app.route("/ingredient_usage", methods=["GET"])
def ingredient_usage():
    cur = get_cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = sql.SQL(
        """
        SELECT
            i.id AS ingredient_id,
            i.name AS ingredient_name,
            COUNT(mii.ingredient_id) AS total_ingredient_count,
            i.quantity AS ingredient_quantity
        FROM
            orders o
            JOIN order_menu_items omi ON o.id = omi.order_id
            JOIN menu_items mi ON omi.menu_item_id = mi.id
            JOIN menu_item_ingredients mii ON mi.id = mii.menu_item_id
            JOIN ingredients i ON mii.ingredient_id = i.id
        WHERE
            o.date >= %s
            AND o.date <= %s
        GROUP BY
            i.id
        ORDER BY
            total_ingredient_count DESC
                """
    )
    cur.execute(query, (start_date, end_date))
    ingredients_info = cur.fetchall()
    cur.close()

    return ingredients_info


# API endpoint for order trends report
@app.route("/order_trends", methods=["GET"])
def order_trends():
    cur = get_cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = sql.SQL(
        "SELECT om1.menu_item_id AS menu_item_id_1, om2.menu_item_id AS menu_item_id_2, COUNT(*) AS count, o.date "
        + "FROM order_menu_items om1 "
        + "JOIN order_menu_items om2 ON om1.order_id = om2.order_id AND om1.menu_item_id < om2.menu_item_id "
        + "JOIN orders o ON om1.order_id = o.id "
        + "WHERE o.date BETWEEN CAST(%s AS TIMESTAMP) AND CAST(%s AS TIMESTAMP) "
        + "GROUP BY om1.menu_item_id, om2.menu_item_id, o.date "
        + "ORDER BY count DESC, o.date ASC;"
    )
    cur.execute(query, (start_date, end_date))
    order_trends = cur.fetchall()
    cur.close()

    return order_trends


@app.route("/attach_menu_items", methods=["POST"])
def attach_menu_items():
    data = request.json

    order_id = data.get("order_id")
    item_id = data.get("item_id")

    cur = get_cursor()
    query = sql.SQL("INSERT INTO order_menu_items (order_id, menu_item_id) VALUES (%s, %s);")
    cur.execute(query, (order_id, item_id))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Table successfully updated",
        }
    )


# API endpoint to submit an order
@app.route("/submit_order", methods=["POST"])
def submit_order():
    data = request.json

    name = data.get("name")
    price = data.get("price")
    date = data.get("date")
    assigned_employee = data.get("assigned_employee")
    cur = get_cursor()
    orders_query = sql.SQL("INSERT INTO orders (name, price, date, assigned_employee) VALUES (%s, %s, %s, %s);")
    cur.execute(orders_query, (name, price, date, assigned_employee))

    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Order submitted successfully",
        }
    )


# API endpoint to update menu item information
@app.route("/menu_item_edit", methods=["POST"])
def menu_item_edit():
    data = request.json

    id = data.get("id")
    name = data.get("name")
    price = data.get("price")

    cur = get_cursor()
    query = sql.SQL("UPDATE menu_items SET price = %s WHERE id = %s;")
    cur.execute(query, (price, id))
    query2 = sql.SQL("UPDATE menu_items SET name = %s WHERE id = %s;")
    cur.execute(query2, (name, id))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "menu item successfully updated",
        }
    )


# API endpoint to add a menu item information
@app.route("/menu_item_add", methods=["POST"])
def menu_item_add():
    data = request.json

    name = data.get("name")
    price = data.get("price")
    type = data.get("type")

    cur = get_cursor()

    orders_query = sql.SQL("INSERT INTO menu_items (name, price, type) VALUES (%s, %s, %s);")
    cur.execute(orders_query, (name, price, type))

    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Menu Item added successfully",
        }
    )

# API endpoint to add a new ingredient
@app.route("/add_ingredient", methods=["POST"])
def add_ingredient():
    data = request.json

    name = data.get("name")
    price = data.get("price")

    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password=database_password, port=5432
        )
        cur = conn.cursor()

    query = sql.SQL("INSERT INTO ingredients (name, price, quantity) VALUES (%s, %s, 0);")
    cur.execute(query, (name, price))

    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Ingredient added successfully",
        }
    )


# API endpoint to fetch 10 most sold menu items
@app.route("/top_ten", methods=["GET"])
def top_ten():
    cur = get_cursor()
    query = sql.SQL(
        "SELECT menu_item_id, COUNT(*) AS category_count FROM order_menu_items GROUP BY menu_item_id ORDER BY category_count DESC LIMIT 10"
    )
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    top_ten = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(top_ten)


# API endpoint to update an employee's salary
@app.route("/salary", methods=["POST"])
def salary():
    data = request.json

    id = data.get("id")
    salary = data.get("salary")

    cur = get_cursor()
    query = sql.SQL("UPDATE employees SET salary = %s WHERE id = %s;")
    cur.execute(query, (salary, id))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Salary successfully updated",
        }
    )


# API endpoint to submit a restock order
@app.route("/restock_order", methods=["POST"])
def restock_order():
    data = request.json

    print("end")
    name = data.get("name")
    price = data.get("price")
    quantity = data.get("quantity")
    ingredient_id = data.get("ingredient_id")

    cur = get_cursor()
    restock_query = sql.SQL("INSERT INTO restock_order (name, price, quantity, ingredient_id) VALUES (%s, %s, %s, %s);")
    cur.execute(restock_query, (name, price, quantity, ingredient_id))

    current_stock_query = sql.SQL("SELECT quantity FROM ingredients WHERE id=%s;")
    cur.execute(current_stock_query, (ingredient_id,))
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


deepl_auth_key = os.getenv("deepl_auth_key")
translator = deepl.Translator(deepl_auth_key)


@app.route("/translate", methods=["POST"])
def translate_text():
    request_json = request.json

    result = translator.translate_text(request_json["text"], source_lang="EN", target_lang=request_json["targetLanguage"])
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
