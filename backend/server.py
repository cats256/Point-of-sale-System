# import eventlet

# eventlet.monkey_patch()
import pydoc
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
    """
    Retrieve a cursor object for database operations.

    If a cursor object already exists, it is returned. If not, a new connection
    to the database is established, and a cursor object is created and returned.

    Returns:
        psycopg2.extensions.cursor: Cursor object for database operations.
    """
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
    """
    Retrieve all ingredients from database.

    This is used to display ingredients in our inventory page. 

    Returns:
        jsonify: JSON response containing information about ingredients in alphabetical order.
    """
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
    """
    Retrieve all menu items from database.

    This is used on the menu page for the manager, as well as the cashier & customer views for 
    placing orders and the menu board.

    Returns:
        jsonify: JSON response containing information about menu items in alphabetical order.
    """
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
    """
    Retrieve information about menu items within a specified range of order IDs.

    It counts the occurrences of each menu item and groups them by menu item ID. This is used in the manager
    reports. qqq

    Returns:
        jsonify: JSON response containing information about ordered menu items.
    """
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
    """
    Retrieve list of categories for menu items.

    This is used to create the drop down list for the menu page in manager view. 

    Returns:
        jsonify: JSON response containing the different menu item categories.
    """
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
    """
    Retrieve list of suppliers for ingredients.

    This is used to create the drop down list for the inventory page in manager view.  

    Returns:
        jsonify: JSON response containing the different ingredient suppliers.
    """
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
    """
    Retrieve all restock orders from database.

    Returns:
        jsonify: JSON response containing information about restock orders.
    """
    cur = get_cursor()
    query = sql.SQL("SELECT * FROM restock_order")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    restock_info = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(restock_info)

# API endpoint to fetch orders in progress 
@app.route("/in_progress", methods=["GET"])
def get_current_orders():
    """
    Retrieve all orders with status "in progress".

    It is used to display current items in the kitchen view. 

    Returns:
        jsonify: JSON response containing information about current orders.
    """
    cur = conn.cursor()
    query = sql.SQL("SELECT id FROM orders WHERE status='in progress';")
    cur.execute(query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    current_orders = [dict(zip(columns, row)) for row in rows]
    cur.close()
    return jsonify(current_orders)

@app.route("/order_menu_item", methods=["GET"])
def get_order_menu_item():
    """
    Retrieve information about menu items not within a specified range of order IDs.

    It counts the occurrences of each menu item and groups them by menu item ID. 

    Returns:
        jsonify: JSON response containing information about ordered menu items.
    """
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
    """
    Retrieve information about menu items given an order id.

    It counts the occurrences of each menu item and groups them by menu item ID. 

    Returns:
        jsonify: JSON response containing information about ordered menu items.
    """
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
    """
    Retrieve all order ids from a specified time range.

    It finds the order ids that were created on a certain date. This is used for the manager reports. 

    Returns:
        list of order ids.
    """
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
    """
    Retrieve information of each employee.

    Returns:
        jsonify: JSON response containing name, salary, position, and email for each employee.
    """
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
    """
    Adds a new row in the employee database.

    Given a name, email, salary, position, and password, it creates a new instance of employee. 

    Returns:
        jsonify: JSON message signaling success
    """
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
    """
    Deletes an employee from the database.

    Given an employee id, it removes their informatinon from the database. 

    Returns:
        jsonify: JSON message signaling success
    """
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
    """
    Retrieves all order information from specified time range. 

    Returns:
        list of order ids. 
    """
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
    """
    Retrieves the current order id. 

    Returns:
        jsonify: JSON response with current id. 
    """
    cur = get_cursor()
    query = sql.SQL("SELECT id FROM orders WHERE id=(SELECT max(id) FROM orders);")
    cur.execute(query)
    order_id = cur.fetchone()[0]
    cur.close()
    return jsonify({"order_id": order_id})


@app.route("/menu_item_id", methods=["GET"])
def menu_item_id():
    """
    Retrieves menu item id. 

    Given the name of a menu item, it returns the id associated with that item.  

    Returns:
        jsonify: JSON response with item id. 
    """
    item_name = request.args.get("name")

    cur = get_cursor()
    query = sql.SQL("SELECT id FROM menu_items WHERE name=%s;")
    cur.execute(query, (item_name,))
    item_id = cur.fetchone()[0]
    cur.close()
    return jsonify({"item_id": item_id})


@app.route("/menu_item_name", methods=["GET"])
def menu_item_name():
    """
    Retrieves menu item name. 

    Given the id of a menu item, it returns the name associated with that id.  

    Returns:
        jsonify: JSON response with menu item name. 
    """
    item_id = request.args.get("id")

    try:
        cur = get_cursor()
        query = sql.SQL("SELECT name FROM menu_items WHERE id=%s;")
        cur.execute(query, (item_id,))
        item_name = cur.fetchone()[0]
        cur.close()

        if item_name:
            return jsonify({"item_name": item_name})
        else:
            return jsonify({"error": "Menu item not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/menu_item_name_list", methods=["GET"])
def menu_item_name_list():
    """
    Retrieves menu item name. 

    Given the id of a menu item, it returns the name associated with that id.  

    Returns:
        jsonify: JSON response with menu item name. 
    """
    item_id = request.args.get("id")

    cur = get_cursor()
    query = sql.SQL("SELECT name FROM menu_items WHERE id=%s;")
    cur.execute(query, (item_id,))
    item_name = cur.fetchone()[0]
    cur.close()
    return jsonify(item_name)


# API endpoint for ingredient usage report
@app.route("/ingredient_usage", methods=["GET"])
def ingredient_usage():
    """
    Retrieve information about ingredient usage within a specified date range.

    It calculates the total count of each ingredient used in menu items ordered during that period, 
    sorted in descending order. 

    Returns:
        list containing id, name, ingredient usage count, and current quanity for each ingredient.
    """
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

# API endpoint for sales report
@app.route("/sales_report", methods=["GET"])
def sales_report():
    cur = get_cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = sql.SQL(
        """
        SELECT
            mi.id AS menu_item_id,
            mi.name AS menu_item_name,
            COUNT(omi.menu_item_id) AS total_sales_count,
            SUM(o.price) AS total_sales_amount
        FROM
            orders o
            JOIN order_menu_items omi ON o.id = omi.order_id
            JOIN menu_items mi ON omi.menu_item_id = mi.id
        WHERE
            o.date >= %s
            AND o.date <= %s
        GROUP BY
            mi.id
        ORDER BY
            total_sales_count DESC
        """
    )
    cur.execute(query, (start_date, end_date))
    sales = cur.fetchall()
    cur.close()

    return sales

# API endpoint for what sells together
@app.route("/what_sells_together", methods=["GET"])
def what_sells_together():
    cur = get_cursor()

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = sql.SQL("""
        SELECT 
            mi1.name AS menu_item_name_1, 
            mi2.name AS menu_item_name_2, 
            COUNT(*) AS count 
        FROM 
            order_menu_items om1 
            JOIN order_menu_items om2 
                ON om1.order_id = om2.order_id AND om1.menu_item_id < om2.menu_item_id
            JOIN orders o 
                ON om1.order_id = o.id
            JOIN menu_items mi1
                ON om1.menu_item_id = mi1.id
            JOIN menu_items mi2
                ON om2.menu_item_id = mi2.id
        WHERE 
            o.date BETWEEN CAST(%s AS TIMESTAMP) AND CAST(%s AS TIMESTAMP)
        GROUP BY 
            mi1.name, 
            mi2.name
        ORDER BY 
            count DESC;
    """)
    cur.execute(query, (start_date, end_date))
    sales = cur.fetchall()
    cur.close()

    return sales


# API endpoint for order trends report
@app.route("/order_trends", methods=["GET"])
def order_trends():
    """
    Retrieve information about what sells well together.

    It calculates the count of pairs of menu items ordered together, sorted by count in descending order.

    Returns:
        list with the 2 ids of the menu items in the pair, the number of orders they were included together, 
        and the date of the orders for each pair.  
    """
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
    """
    Associates an order id to the menu item id of the item that was ordered.

    Returns:
        jsonify: JSON message indicating success
    """
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
    """
    Adds a new order to the database. 

    Given the name, price, date, and assigned employee, a new row is created in the orders table 
    with the automatically calculated next order id and status "in progress".

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json

    name = data.get("name")
    price = data.get("price")
    date = data.get("date")
    assigned_employee = data.get("assigned_employee")
    status = "in progress"
    try:
        cur = conn.cursor()
    except:
        conn = psycopg2.connect(
            host="csce-315-db.engr.tamu.edu", user="csce315_902_03_user", dbname="csce315_902_03_db", password=database_password, port=5432
        )
        cur = conn.cursor()

    orders_query = sql.SQL("INSERT INTO orders (name, price, date, assigned_employee, status) VALUES (%s, %s, %s, %s, %s);")
    cur.execute(orders_query, (name, price, date, assigned_employee, status))

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
    """
    Updates the name and price of menu item. 

    Given a new name and price, it changes the values associated with that menu item id in the menu item table. 

    Returns:
        jsonify: JSON message indicating success
    """
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

# API endpoint to update menu item information
@app.route("/menu_item_delete", methods=["POST"])
def menu_item_delete():
    """
    Deletes a menu item from the database. 

    Given a menu item id, it removes that row from the database. 

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json

    id = data.get("id")
    # print(id)

    cur = get_cursor()
    query = sql.SQL("DELETE FROM menu_items WHERE id = %s;")
    cur.execute(query, (id, ))
    query2 = sql.SQL("DELETE FROM order_menu_items WHERE menu_item_id = %s;")
    cur.execute(query2, (id, ))
    # try:
    #     query2 = sql.SQL("DELETE FROM order_menu_items WHERE menu_item_id = %s;")
    #     cur.execute(query2, (id, ))
    # except psycopg2.Error as e:
    #     print(f"menu item had not been ordered: {e}")
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "menu item successfully deleted",
        }
    )

# API endpoint to update ingredient information
@app.route("/ingredient_edit", methods=["POST"])
def ingredient_edit():
    """
    Updates the name, price, and supplier of ingredient. 

    Given a new name, price, and supplier, it changes the values associated with that ingredient id in the ingredient table. 

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json

    id = data.get("id")
    name = data.get("name")
    price = data.get("price")
    supplier = data.get("supplier")

    cur = get_cursor()
    query = sql.SQL("UPDATE ingredients SET price = %s WHERE id = %s;")
    cur.execute(query, (price, id))
    query2 = sql.SQL("UPDATE ingredients SET name = %s WHERE id = %s;")
    cur.execute(query2, (name, id))
    query3 = sql.SQL("UPDATE ingredients SET supplier = %s WHERE id = %s;")
    cur.execute(query3, (supplier, id))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "ingredient successfully updated",
        }
    )

# API endpoint to delete ingredient
@app.route("/ingredient_delete", methods=["POST"])
def ingredient_delete():
    """
    Deletes an ingredient from the database. 

    Given an ingredient id, it removes that row from the database. 

    Returns:
        jsonify: JSON message indicating success
    """
    id = request.args.get("id")

    cur = get_cursor()
    query0 = sql.SQL("DELETE FROM restock_order WHERE id = %s;")
    cur.execute(query0, (id, ))
    query = sql.SQL("DELETE FROM ingredients WHERE id = %s;")
    cur.execute(query, (id, ))
    query2 = sql.SQL("DELETE FROM menu_item_ingredients WHERE ingredient_id = %s;")
    cur.execute(query2, (id, ))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "ingredient successfully deleted",
        }
    )

# API endpoint to mark order completed 
@app.route("/completed", methods=["POST"])
def complete_order():
    """
    Updates status of order in database to completed. 

    Given an order id, it changes the status of the order to "completed". 

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json

    id = data.get("id")

    cur = conn.cursor()
    query = sql.SQL("UPDATE orders SET status='completed' WHERE id = %s;")
    cur.execute(query, (id,))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "order successfully completed",
        }
    )

# API endpoint to mark order cancelled 
@app.route("/cancelled", methods=["POST"])
def cancel_order():
    """
    Updates status of order in database to cancelled. 

    Given an order id, it changes the status of the order to "cancelled". 

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json

    id = data.get("id")

    cur = conn.cursor()
    query = sql.SQL("UPDATE orders SET status='cancelled' WHERE id = %s;")
    cur.execute(query, (id,))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "order successfully cancelled",
        }
    )

@app.route("/delete", methods=["POST"])
def delete_order():
    """
    Removes order from database. 

    Given an order id, it removes that row from the database. It also removes the corresponding entries in the 
    menu item orders table. 

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json
    order_id = data.get("id")

    cur = conn.cursor()

    query_delete_menu_items = sql.SQL("DELETE FROM order_menu_items WHERE order_id = %s;")
    cur.execute(query_delete_menu_items, (order_id,))
        
    query_delete_order = sql.SQL("DELETE FROM orders WHERE id = %s;")
    cur.execute(query_delete_order, (order_id,))
      
    conn.commit()
    cur.close()
    return jsonify({"message": "Order successfully deleted"})





# API endpoint to add a menu item information
@app.route("/menu_item_add", methods=["POST"])
def menu_item_add():
    """
    Adds new row to menu items table. 

    Given a name, price, and type, a new menu item is created in the database. 

    Returns:
        jsonify: JSON message indicating success
    """
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
    """
    Adds new row to ingredients table. 

    Given a name, price, and supplier, a new ingredient is created in the database. Quantity is automatically 
    set to 0.

    Returns:
        jsonify: JSON message indicating success
    """
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
    """
    Retrieves the 10 most sold menu items. 

    It searches the order menu items table to find the top 10 most ordered menu items.  

    Returns:
        jsonify: JSON response with item ids and counts for the 10 menu items. 
    """
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

# API endpoint to fetch 10 most sold menu items
@app.route("/highest_employee_id", methods=["GET"])
def highest_employee_id():
    """
    Retrieves the largest employee id

    Returns:
        jsonify: JSON response with employee id
    """
    cur = get_cursor()
    query = sql.SQL("SELECT MAX(id) AS max_id FROM employees;")
    cur.execute(query)
    highest_id = cur.fetchone()[0]
    cur.close()
    return jsonify({"highest_id": highest_id})

# API endpoint to fetch 10 most sold menu items
@app.route("/highest_menu_item_id", methods=["GET"])
def highest_menu_item_id():
    """
    Retrieves the largest menu item id

    Returns:
        jsonify: JSON response with menu item id
    """
    cur = get_cursor()
    query = sql.SQL("SELECT MAX(id) AS max_id FROM menu_items;")
    cur.execute(query)
    highest_id = cur.fetchone()[0]
    cur.close()
    return jsonify({"highest_id": highest_id})


# API endpoint to update an employee's salary
@app.route("/salary", methods=["POST"])
def salary():
    """
    Updates the salary of an employee in the database.  

    Given an employee id and a new salary, it changes the salary of the employee in the employee table. 

    Returns:
        jsonify: JSON message indicating success
    """
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

# API endpoint to update an employee's email
@app.route("/email", methods=["POST"])
def email():
    """
    Updates the salary of an employee in the database.  

    Given an employee id and a new salary, it changes the salary of the employee in the employee table. 

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json

    id = data.get("id")
    email = data.get("email")

    cur = get_cursor()
    query = sql.SQL("UPDATE employees SET email = %s WHERE id = %s;")
    cur.execute(query, (email, id))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Email successfully updated",
        }
    )

# API endpoint to update an employee's position
@app.route("/position", methods=["POST"])
def position():
    """
    Updates the salary of an employee in the database.  

    Given an employee id and a new salary, it changes the salary of the employee in the employee table. 

    Returns:
        jsonify: JSON message indicating success
    """
    data = request.json

    id = data.get("id")
    manager = data.get("manager")

    cur = get_cursor()
    query = sql.SQL("UPDATE employees SET manager = %s WHERE id = %s;")
    cur.execute(query, (manager, id))
    conn.commit()
    cur.close()
    return jsonify(
        {
            "message": "Email successfully updated",
        }
    )

# API endpoint to get menu items associated with order
@app.route("/menu_id_list", methods=["GET"])
def menu_id_list():
    """
    Retrieves all menu item ids associated with order id. 

    Returns:
        jsonify: JSON response with menu item id
    """

    order_id = request.args.get("id")

    cur = get_cursor()
    query = sql.SQL("SELECT menu_item_id FROM order_menu_items WHERE order_id=%s;")
    cur.execute(query, (order_id, ))
    id_list = cur.fetchall()
    cur.close()
    return jsonify(id_list)


# API endpoint to submit a restock order
@app.route("/restock_order", methods=["POST"])
def restock_order():
    """
    Adds new restock order to database. 

    Given an ingredient name, id, quantity to order, and price, it creates a new instance of restock order in the
    restock table. The quantity is updated by adding the current quantity to the quantity of restock. 

    Returns:
        jsonify: JSON message indicating success
    """
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
    """
    Translate text from one language to another.

    It uses the DeepL API to translate the text from the source language (English) 
    to the specified target language.

    Returns:
        jsonify: JSON response containing the translated text.
    """
    request_json = request.json

    result = translator.translate_text(request_json["text"], source_lang="EN", target_lang=request_json["targetLanguage"])
    return jsonify(result.text)


@app.route("/languages", methods=["GET"])
def get_languages():
    """
    Retrieve a list of supported target languages for translation.

    This function retrieves a list of supported target languages for translation 
    from the DeepL translation service.

    Returns:
        jsonify: JSON response with language names and their corresponding language codes.
    """
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

pydoc.writedoc("server")
