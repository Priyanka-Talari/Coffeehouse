import mysql.connector
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Database Configuration
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Sophia@2970",
    "database": "coffee_inventory",
}

# Function to connect to the database
def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        logger.debug("Database connection successful")
        return conn
    except mysql.connector.Error as e:
        logger.error("Database Connection Error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models - Updated to include all fields
class ItemCreate(BaseModel):
    name: str
    quantity: int
    category: str = None
    unit_price: float = 0.0  # Price in INR
    low_stock_threshold: int = 5
    is_available: bool = True

class ItemUpdate(BaseModel):
    name: str = None
    quantity: int = None
    category: str = None
    unit_price: float = None
    low_stock_threshold: int = None
    is_available: bool = None

# Test database connection
@app.get("/test_db/")
def test_db_connection():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"message": "Database Connection Successful", "result": result}
    except Exception as e:
        logger.error("Database Test Error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

# Get all items
@app.get("/items/")
def get_items():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM inventory")
        items = cursor.fetchall()
        logger.debug(f"Fetched {len(items)} items from inventory table")
        cursor.close()
        conn.close()
        return items
    except Exception as e:
        logger.error("Error fetching items: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Failed to fetch items: {str(e)}")

# Add a new item - Updated to include all fields
@app.post("/items/")
def create_item(item: ItemCreate):
    logger.debug(f"Received Data: {item}")

    if item.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")
    
    if item.unit_price < 0:
        raise HTTPException(status_code=400, detail="Price cannot be negative")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO inventory (name, quantity, category, unit_price, low_stock_threshold, is_available) VALUES (%s, %s, %s, %s, %s, %s)",
            (item.name, item.quantity, item.category, item.unit_price, item.low_stock_threshold, item.is_available)
        )
        conn.commit()
        logger.debug("Item Inserted Successfully")
        return {"message": "Item added successfully"}
    except mysql.connector.IntegrityError as e:
        logger.error("Database Error: %s", str(e))
        raise HTTPException(status_code=400, detail="Item with this name already exists")
    except Exception as e:
        logger.error("Unexpected Error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Update an existing item - Updated to include all fields
@app.put("/items/{item_id}")
def update_item(item_id: int, item: ItemUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if item exists
        cursor.execute("SELECT * FROM inventory WHERE id = %s", (item_id,))
        existing_item = cursor.fetchone()

        if not existing_item:
            raise HTTPException(status_code=404, detail="Item not found")

        update_fields = []
        values = []
        
        if item.name:
            update_fields.append("name = %s")
            values.append(item.name)
        if item.quantity is not None:
            if item.quantity < 0:
                raise HTTPException(status_code=400, detail="Quantity cannot be negative")
            update_fields.append("quantity = %s")
            values.append(item.quantity)
        if item.category:
            update_fields.append("category = %s")
            values.append(item.category)
        if item.unit_price is not None:
            if item.unit_price < 0:
                raise HTTPException(status_code=400, detail="Price cannot be negative")
            update_fields.append("unit_price = %s")
            values.append(item.unit_price)
        if item.low_stock_threshold is not None:
            update_fields.append("low_stock_threshold = %s")
            values.append(item.low_stock_threshold)
        if item.is_available is not None:
            update_fields.append("is_available = %s")
            values.append(item.is_available)

        if not update_fields:
            return {"message": "No fields to update"}

        values.append(item_id)
        cursor.execute(f"UPDATE inventory SET {', '.join(update_fields)} WHERE id = %s", tuple(values))
        conn.commit()
        return {"message": "Item updated successfully"}
    except Exception as e:
        logger.error("Error updating item: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Delete an item
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if item exists
        cursor.execute("SELECT * FROM inventory WHERE id = %s", (item_id,))
        item = cursor.fetchone()

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        cursor.execute("DELETE FROM inventory WHERE id = %s", (item_id,))
        conn.commit()
        return {"message": "Item deleted successfully"}
    except Exception as e:
        logger.error("Error deleting item: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)