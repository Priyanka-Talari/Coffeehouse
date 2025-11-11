from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
import mysql.connector
from typing import List, Optional
import shutil
import os

router = APIRouter()

# Database Connection Function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Sophia@2970",
        database="coffee_inventory"
    )

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Fetch all categories
@router.get("/categories/")
def get_categories():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories ORDER BY display_order ASC")
    categories = cursor.fetchall()
    db.close()
    return categories

# Fetch menu items by category
@router.get("/items/")
def get_menu_items(category_id: Optional[int] = None, include_inactive: bool = False):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    sql = "SELECT * FROM menu_items"
    params = []

    if category_id:
        sql += " WHERE category_id = %s"
        params.append(category_id)

    if not include_inactive:
        sql += " AND is_available = TRUE" if category_id else " WHERE is_available = TRUE"

    cursor.execute(sql, params)
    menu_items = cursor.fetchall()
    
    db.close()
    return menu_items

# Add a new menu item
@router.post("/items/")
def add_menu_item(
    name: str,
    price: float,
    description: str,
    category_id: int,
    is_available: bool = True,
    is_seasonal: bool = False,
    image: UploadFile = File(None)
):
    db = get_db_connection()
    cursor = db.cursor()
    
    image_path = None
    if image:
        image_path = f"{UPLOAD_DIR}/{image.filename}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    sql = """
        INSERT INTO menu_items (name, price, description, category_id, is_available, is_seasonal, image)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    values = (name, price, description, category_id, is_available, is_seasonal, image_path)

    cursor.execute(sql, values)
    db.commit()
    db.close()

    return {"message": "Menu item added successfully"}

# Update a menu item
@router.put("/items/{item_id}")
def update_menu_item(item_id: int, name: Optional[str] = None, price: Optional[float] = None, description: Optional[str] = None, is_available: Optional[bool] = None, is_seasonal: Optional[bool] = None, category_id: Optional[int] = None):
    db = get_db_connection()
    cursor = db.cursor()

    update_fields = []
    values = []

    if name:
        update_fields.append("name = %s")
        values.append(name)
    if price:
        update_fields.append("price = %s")
        values.append(price)
    if description:
        update_fields.append("description = %s")
        values.append(description)
    if is_available is not None:
        update_fields.append("is_available = %s")
        values.append(is_available)
    if is_seasonal is not None:
        update_fields.append("is_seasonal = %s")
        values.append(is_seasonal)
    if category_id:
        update_fields.append("category_id = %s")
        values.append(category_id)

    if not update_fields:
        db.close()
        raise HTTPException(status_code=400, detail="No fields to update")

    sql = f"UPDATE menu_items SET {', '.join(update_fields)} WHERE id = %s"
    values.append(item_id)

    cursor.execute(sql, values)
    db.commit()
    db.close()

    return {"message": "Menu item updated successfully"}

# Delete a menu item
@router.delete("/items/{item_id}")
def delete_menu_item(item_id: int):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("DELETE FROM menu_items WHERE id = %s", (item_id,))
    db.commit()
    db.close()

    return {"message": "Menu item deleted successfully"}

# Update item availability
@router.put("/items/{item_id}/availability")
def update_item_availability(item_id: int, is_available: bool):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("UPDATE menu_items SET is_available = %s WHERE id = %s", (is_available, item_id))
    db.commit()
    db.close()

    return {"message": "Item availability updated successfully"}

# Fetch popular items
@router.get("/analytics/popular-items")
def get_popular_items(limit: int = 10):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM menu_items ORDER BY purchase_count DESC LIMIT %s", (limit,))
    popular_items = cursor.fetchall()

    db.close()
    return popular_items
