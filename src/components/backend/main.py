from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import mysql.connector

DATABASE_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Sophia@2970",
    "database": "coffee_inventory",
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

# Define default temperature for drinks (removed hot/cold options)
STRICTLY_HOT_DRINKS = [
    "Espresso", "Cortado", "Flat White", "Drip Coffee", "Filter Kappi",
    "Jaggery Cappuccino", "Masala Coffee Latte", "Dried Fruit Saffron Milk",
    "Date and Cinnamon Latte", "Jaggery Almond Hot Chocolate"
]

STRICTLY_COLD_DRINKS = [
    "Iced Americano", "Iced Latte", "Iced Mocha", "Cold Brew", "Nitro Cold Brew",
    "Aam Panna Cold Brew", "Mango Malai Frappe", "Lemon Mint Espresso Cooler"
]

shop_data = {
    "hours": "9 AM - 9 PM",
    "bestsellers": ["Cappuccino", "Latte", "Espresso"],
    "menu": {
        "Espresso-Based Drinks": [
            {"name": "Espresso", "price": 350},
            {"name": "Americano", "price": 300},
            {"name": "Caramel Macchiato", "price": 320},
            {"name": "Cortado", "price": 340},
            {"name": "Flat White", "price": 360},
            {"name": "Cappuccino", "price": 250},
            {"name": "Latte", "price": 450},
            {"name": "Mocha", "price": 400}
        ],
        "Brewed Coffee": [
            {"name": "Drip Coffee", "price": 200}
        ],
        "Cold Coffee": [
            {"name": "Iced Americano", "price": 280},
            {"name": "Iced Latte", "price": 330},
            {"name": "Iced Mocha", "price": 370},
            {"name": "Cold Brew", "price": 400},
            {"name": "Nitro Cold Brew", "price": 420}
        ],
        "Flavored & Specialty": [
            {"name": "Caramel Latte", "price": 390},
            {"name": "Vanilla Latte", "price": 380},
            {"name": "Hazelnut Mocha", "price": 410},
            {"name": "Pumpkin Spice Latte", "price": 430},
            {"name": "Honey Almond Latte", "price": 400},
            {"name": "Coconut Mocha", "price": 420}
        ],
        "Summer Specials": [
            {"name": "Aam Panna Cold Brew", "price": 450},
            {"name": "Mango Malai Frappe", "price": 480},
            {"name": "Lemon Mint Espresso Cooler", "price": 420}
        ],
        "Monsoon Favorites": [
            {"name": "Masala Coffee Latte", "price": 380},
            {"name": "Jaggery Cappuccino", "price": 360},
            {"name": "Filter Kappi", "price": 300}
        ],
        "Winter Warmers": [
            {"name": "Dried Fruit Saffron Milk", "price": 450},
            {"name": "Date and Cinnamon Latte", "price": 420},
            {"name": "Jaggery Almond Hot Chocolate", "price": 440}
        ]
    },
    "sizes": ["Small", "Medium", "Large"],
    # Replaced original sugar options with new sweetener types
    "sweetener_options": ["White Sugar", "Brown Sugar", "Honey", "Stevia", "None"],
    # Added new caffeine preferences
    "caffeine_options": ["Regular", "Decaf", "Half-Caf"],
    "milk_types": ["Almond Milk", "Soy Milk", "Whole Milk", "Oat Milk"],
    "side_items_categories": [
        "Croissants",
        "Donuts",
        "Cheesecakes",
        "Muffins",
        "Cookies",
        "Healthy Options",
        "Gluten-Free Pastries"
    ],
    "side_items": {
        "Croissants": [
            {"name": "Almond Croissant", "price": 250},
            {"name": "Chocolate Croissant", "price": 270},
            {"name": "Strawberry Croissant", "price": 260}
        ],
        "Cheesecakes": [
            {"name": "Strawberry Cheesecake", "price": 300},
            {"name": "Biscoff Cheesecake", "price": 320},
            {"name": "Blueberry Cheesecake", "price": 310}
        ],
        "Cookies": [
            {"name": "Milk Chocolate Cookie", "price": 180},
            {"name": "Peanut Butter Cookie", "price": 190},
            {"name": "Double Chocolate Cookie", "price": 200}
        ],
        "Muffins": [
            {"name": "Chocolate Muffin", "price": 220},
            {"name": "Vanilla Muffin", "price": 210},
            {"name": "Blueberry Muffin", "price": 230}
        ],
        "Donuts": [
            {"name": "Vanilla Donut", "price": 200},
            {"name": "Chocolate Sprinkle Donut", "price": 220},
            {"name": "M&M Candies Donut", "price": 240}
        ],
        "Healthy Options": [
            {"name": "Avocado Toast", "price": 380},
            {"name": "Quinoa & Chickpea Salad", "price": 350},
            {"name": "Energy Bliss Balls", "price": 250}
        ],
        "Gluten-Free Pastries": [
            {"name": "Almond Flour Brownies", "price": 280},
            {"name": "Rice Flour Waffles", "price": 320},
            {"name": "Chia Seed Pudding", "price": 300}
        ]
    },
    "feedback_options": [
        "Excellent service!",
        "Good coffee but slow service",
        "Average experience",
        "Need improvement",
        "Poor service",
        "Custom Feedback"
    ]
}

class ChatRequest(BaseModel):
    message: str

class FeedbackRequest(BaseModel):
    user_id: str
    feedback: str
    rating: str

user_state = {}

def get_db_connection():
    return mysql.connector.connect(**DATABASE_CONFIG)

def create_feedback_table():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255),
            feedback TEXT,
            rating VARCHAR(50)
        )
    """)
    connection.commit()
    cursor.close()
    connection.close()

create_feedback_table()

def get_all_coffees():
    all_coffees = []
    for category in shop_data["menu"].values():
        all_coffees.extend([item["name"] for item in category])
    return all_coffees

@app.post("/api/chat")
async def chat(request: ChatRequest):
    user_message = request.message.lower()
    logger.info(f"Received: {user_message}")
    
    user_id = "default_user"
    if user_id not in user_state:
        user_state[user_id] = {}
   
    state = user_state[user_id]
    
    # Fix for Place Order button - changed to exact match for "place order"
    if user_message == "place order":
        state.clear()
        state["ordering"] = True
        all_coffees = get_all_coffees()
        return {"response": "Which coffee would you like to order?", "buttons": all_coffees}
    
    if "hours" in user_message or "open" in user_message or "opening hours" in user_message:
        return {"response": f"Our opening hours are: {shop_data['hours']}"}
    
    if "menu" in user_message or "view menu" in user_message:
        menu_response = "Here's our menu:\n"
        for category, items in shop_data["menu"].items():
            menu_response += f"\n*{category}*:\n"
            for item in items:
                menu_response += f"- {item['name']} (₹{item['price']})\n"
        return {"response": menu_response.strip()}
    
    if "bestsellers" in user_message:
        bestsellers_response = "Our bestsellers are:\n" + "\n".join(f"- {item}" for item in shop_data["bestsellers"])
        return {"response": bestsellers_response}
    
    if state.get("ordering"):
        if "coffee" not in state:
            coffee = None
            for category in shop_data["menu"].values():
                for item in category:
                    if item["name"].lower() in user_message.lower():
                        coffee = item["name"]
                        state["coffee"] = coffee
                        state["price"] = item["price"]
                        break
                if coffee:
                    break
           
            if coffee:
                # Set default temperature based on drink type (for information only)
                if coffee in STRICTLY_HOT_DRINKS:
                    state["temperature"] = "Hot"
                elif coffee in STRICTLY_COLD_DRINKS:
                    state["temperature"] = "Cold"
                else:
                    # For drinks that can be either, default to hot
                    state["temperature"] = "Hot"
                
                # Ask for caffeine preference instead of temperature
                return {"response": f"You selected {coffee}. Please select your caffeine preference:", 
                        "buttons": shop_data["caffeine_options"]}
            return {"response": "Please choose a valid coffee from our menu.", "buttons": get_all_coffees()}
        
        if "coffee" in state and "caffeine" not in state:
            caffeine = next((c for c in shop_data["caffeine_options"] if c.lower() in user_message.lower()), None)
            if caffeine:
                state["caffeine"] = caffeine
                return {"response": "Choose your sweetener:", "buttons": shop_data["sweetener_options"]}
            return {"response": "Please select a valid caffeine preference.", "buttons": shop_data["caffeine_options"]}
        
        if "caffeine" in state and "sweetener" not in state:
            sweetener = next((s for s in shop_data["sweetener_options"] if s.lower() in user_message.lower()), None)
            if sweetener:
                state["sweetener"] = sweetener
                return {"response": "Choose your cup size:", "buttons": shop_data["sizes"]}
            return {"response": "Please select a valid sweetener option.", "buttons": shop_data["sweetener_options"]}
        
        if "sweetener" in state and "size" not in state:
            size = next((s for s in shop_data["sizes"] if s.lower() in user_message.lower()), None)
            if size:
                state["size"] = size
                # At this point, check if we need to ask for milk type
                return {"response": "Choose your milk type:", "buttons": shop_data["milk_types"]}
            return {"response": "Please choose a valid size.", "buttons": shop_data["sizes"]}
        
        if "size" in state and "milk" not in state:
            milk = next((m for m in shop_data["milk_types"] if m.lower() in user_message.lower()), None)
            if milk:
                state["milk"] = milk
                return {
                    "response": "Would you like something to eat with your coffee?",
                    "buttons": shop_data["side_items_categories"] + ["No, thanks"]
                }
            return {"response": "Please choose a valid milk type.", "buttons": shop_data["milk_types"]}
        
        if "milk" in state and "side_item_category" not in state:
            if "no" in user_message.lower() or "thanks" in user_message.lower():
                # Updated order summary to include new options and remove temperature
                order_summary = (
                    f"Order Summary:\n"
                    f"- {state['coffee']} ({state['caffeine']})\n"
                    f"- Sweetener: {state['sweetener']}\n" 
                    f"- Size: {state['size']}\n"
                    f"- Milk: {state['milk']}\n"
                    f"- Price: ₹{state['price']}"
                )
                state["completed"] = True
                return {
                    "response": f"Thank you for your order! Here's your summary:\n\n{order_summary}",
                    "buttons": ["Rate Experience", "Give Feedback", "Place New Order"]
                }
           
            category = next((cat for cat in shop_data["side_items_categories"] if cat.lower() in user_message.lower()), None)
            if category:
                state["side_item_category"] = category
                return {
                    "response": f"Which {category} would you like?",
                    "buttons": [item["name"] for item in shop_data["side_items"][category]]
                }
            return {"response": "Please choose a valid category or select 'No, thanks'.", 
                    "buttons": shop_data["side_items_categories"] + ["No, thanks"]}
        
        if "side_item_category" in state and "side_item" not in state:
            selected_item = None
            for item in shop_data["side_items"][state["side_item_category"]]:
                if item["name"].lower() in user_message.lower():
                    selected_item = item
                    break
                    
            if selected_item:
                state["side_item"] = selected_item["name"]
                state["side_item_price"] = selected_item["price"]
                total_price = state["price"] + state["side_item_price"]
                state["total_price"] = total_price
               
                # Updated order summary to include new options and remove temperature
                order_summary = (
                    f"Order Summary:\n"
                    f"- {state['coffee']} ({state['caffeine']})\n"
                    f"- Sweetener: {state['sweetener']}\n"
                    f"- Size: {state['size']}\n"
                    f"- Milk: {state['milk']}\n"
                    f"- Side Item: {state['side_item']}\n"
                    f"- Total Price: ₹{total_price}"
                )
                state["completed"] = True
                return {
                    "response": f"Thank you for your order! Here's your summary:\n\n{order_summary}",
                    "buttons": ["Rate Experience", "Give Feedback", "Place New Order"]
                }
            return {"response": f"Please choose a valid {state['side_item_category']}.", 
                    "buttons": [item["name"] for item in shop_data["side_items"][state["side_item_category"]]]}
    
    # Handle feedback and ratings flow before new order
    if "rate" in user_message.lower() or "experience" in user_message.lower():
        return {"response": "Please rate your experience:", "buttons": ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]}
    
    if user_message in ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]:
        state["rating"] = user_message
        return {"response": "Thank you for your rating! Would you like to provide feedback?", 
                "buttons": ["Give Feedback", "No Thanks, Proceed to Checkout"]}
    
    if "no thanks, proceed to checkout" in user_message.lower():
        return {"response": "Thank you for your order! Your coffee will be ready soon. Would you like to place a new order?", 
                "buttons": ["Place New Order", "View Menu", "Bestsellers"]}
    
    if "feedback" in user_message.lower() or "give feedback" in user_message.lower():
        return {"response": "Please choose your feedback or type your own:", "buttons": shop_data["feedback_options"]}
    
    if state.get("feedback_pending"):
        state["feedback"] = user_message
        state.pop("feedback_pending")
        feedback_data = FeedbackRequest(user_id=user_id, feedback=state["feedback"], rating=state.get("rating", ""))
        await submit_feedback(feedback_data)
        return {"response": "Thank you for your feedback! Would you like to proceed to checkout?",
                "buttons": ["Proceed to Checkout"]}
    
    if any(user_message.lower() == option.lower() for option in shop_data["feedback_options"]):
        if user_message.lower() == "custom feedback":
            state["feedback_pending"] = True
            return {"response": "Please type your feedback:"}
        feedback_data = FeedbackRequest(user_id=user_id, feedback=user_message, rating=state.get("rating", ""))
        await submit_feedback(feedback_data)
        return {"response": "Thank you for your feedback! Would you like to proceed to checkout?",
                "buttons": ["Proceed to Checkout"]}
    
    if "proceed to checkout" in user_message.lower():
        return {"response": "Thank you for your order! Your coffee will be ready soon. Would you like to place a new order?", 
                "buttons": ["Place New Order", "View Menu", "Bestsellers"]}
    
    if "place new order" in user_message.lower():
        state.clear()
        state["ordering"] = True
        all_coffees = get_all_coffees()
        return {"response": "Which coffee would you like to order?", "buttons": all_coffees}
    
    return {"response": "How can I help you today?", "buttons": ["Place Order", "View Menu", "Opening Hours", "Bestsellers"]}

@app.post("/api/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO feedback (user_id, feedback, rating)
            VALUES (%s, %s, %s)
        """, (feedback.user_id, feedback.feedback, feedback.rating))
        connection.commit()
        return {"message": "Feedback submitted successfully"}
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/feedback")
async def get_feedback():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM feedback")
        feedback = cursor.fetchall()
        return feedback
    except Exception as e:
        logger.error(f"Error fetching feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch feedback")
    finally:
        cursor.close()
        connection.close()