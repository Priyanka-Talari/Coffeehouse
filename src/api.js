import axios from "axios";

const API_URL = "http://localhost:8000"; // FastAPI backend

// Enhanced error handling function
const handleApiError = (error, action) => {
  let errorMessage = `Failed to ${action}`;
  let errorDetails = null;
  
  if (error.response) {
    errorDetails = error.response.data;
    errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
    
    if (error.response.status === 404) {
      errorMessage = `Endpoint not found (404) while trying to ${action}`;
    } else if (error.response.status === 401) {
      errorMessage = `Unauthorized (401) while trying to ${action}`;
    } else if (error.response.status === 500) {
      errorMessage = `Server error (500) while trying to ${action}`;
    }
  } else if (error.request) {
    errorMessage = `No response received while trying to ${action}`;
    errorDetails = { networkError: true };
  } else {
    errorMessage = error.message || errorMessage;
  }

  console.error(`Error ${action}:`, errorDetails || error.message);
  throw new Error(errorMessage);
};

// ✅ Fetch categories
export const fetchCategories = async () => {
  try {
    console.log("Fetching categories...");
    const response = await axios.get(`${API_URL}/categories/`);
    console.log("✅ Categories received:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetch categories");
  }
};

// ✅ Fetch all inventory items - Updated with better error handling
export const fetchInventory = async () => {
  try {
    console.log("Fetching inventory...");
    const response = await axios.get(`${API_URL}/items/`, {
      validateStatus: function (status) {
        return status < 500; // Resolve only if status code is less than 500
      }
    });
    
    if (response.status === 404) {
      console.warn("Inventory endpoint not found, returning empty array");
      return [];
    }
    
    console.log("✅ Inventory data received:", response.data);
    return response.data;
  } catch (error) {
    console.warn("Error fetching inventory, returning empty array");
    return [];
  }
};

// ✅ Fetch menu items (only available items for customers)
export const fetchMenuItems = async () => {
  try {
    console.log("Fetching available menu items...");
    const response = await axios.get(`${API_URL}/menu/`, {
      params: { include_inactive: false },
      validateStatus: function (status) {
        return status < 500;
      }
    });
    
    if (response.status === 404) {
      console.warn("Menu endpoint not found, returning empty array");
      return [];
    }
    
    console.log("✅ Menu items received:", response.data);
    return response.data;
  } catch (error) {
    console.warn("Error fetching menu items, returning empty array");
    return [];
  }
};

// ✅ Fetch popular menu items
export const getPopularItems = async (limit = 10) => {
  try {
    console.log(`Fetching top ${limit} popular items...`);
    const response = await axios.get(`${API_URL}/analytics/popular-items`, {
      params: { limit },
      validateStatus: function (status) {
        return status < 500;
      }
    });
    
    if (response.status === 404) {
      console.warn("Popular items endpoint not found, returning empty array");
      return [];
    }
    
    console.log("✅ Popular items received:", response.data);
    return response.data;
  } catch (error) {
    console.warn("Error fetching popular items, returning empty array");
    return [];
  }
};

// ✅ Add a new item (with validation)
export const addItem = async (item) => {
  try {
    console.log("Adding item:", item);

    // Validate required fields
    if (!item.name || item.price === undefined || !item.category_id) {
      throw new Error("Missing required fields: name, price, or category_id");
    }

    const formData = new FormData();
    Object.keys(item).forEach((key) => {
      if (key === "image" && item[key]) {
        formData.append("image", item[key]);
      } else if (item[key] !== undefined) {
        formData.append(key, item[key]);
      }
    });

    console.log("📝 FormData before sending:", Object.fromEntries(formData));

    const response = await axios.post(`${API_URL}/items/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Item added successfully:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "add item");
  }
};

// ✅ Update an existing item (with improved validation)
export const updateItem = async (itemId, item) => {
  try {
    console.log(`Updating item ${itemId}...`, item);

    // Fetch the current item details to get existing values
    const currentItemResponse = await axios.get(`${API_URL}/items/${itemId}`);
    const currentItem = currentItemResponse.data;

    // Create a copy of the item to avoid modifying the original object
    const updateData = { ...item };

    // Ensure required fields are present, using existing values if not provided
    updateData.name = updateData.name || currentItem.name;
    updateData.price = updateData.price !== undefined ? updateData.price : currentItem.price;
    updateData.category_id = updateData.category_id || currentItem.category_id;

    const formData = new FormData();
    Object.keys(updateData).forEach((key) => {
      if (key === "image" && updateData[key]) {
        formData.append("image", updateData[key]);
      } else if (updateData[key] !== undefined) {
        formData.append(key, updateData[key]);
      }
    });

    console.log("📝 FormData before sending:", Object.fromEntries(formData));

    const response = await axios.put(`${API_URL}/items/${itemId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Item updated successfully:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "update item");
  }
};

// ✅ Delete an item
export const deleteItem = async (itemId) => {
  try {
    console.log(`Deleting item ${itemId}...`);
    const response = await axios.delete(`${API_URL}/items/${itemId}`);
    console.log("✅ Item deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "delete item");
  }
};

// ✅ Update item availability (In Stock / Out of Stock)
export const updateItemAvailability = async (itemId, isAvailable) => {
  try {
    console.log(`Updating item ${itemId} availability to ${isAvailable}...`);
    const response = await axios.put(`${API_URL}/items/${itemId}/availability`, {
      is_available: isAvailable,
    });
    console.log("✅ Item availability updated:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "update item availability");
  }
};

// ✅ Process payment - Enhanced function with redirection
export const processPayment = async (paymentDetails, redirectCallback = null) => {
  try {
    console.log("Processing payment:", paymentDetails);

    // Validate payment details
    if (!paymentDetails.order_id || !paymentDetails.amount || !paymentDetails.payment_method) {
      throw new Error("Missing required fields: order_id, amount, or payment_method");
    }

    const response = await axios.post(`${API_URL}/payments/process`, paymentDetails);
    console.log("✅ Payment processed successfully:", response.data);
    
    // Handle redirection based on payment method if callback provided
    if (redirectCallback && response.data.redirect_url) {
      redirectCallback(response.data.redirect_url);
    }
    
    return response.data;
  } catch (error) {
    return handleApiError(error, "process payment");
  }
};

// ✅ Verify payment status - New function
export const verifyPaymentStatus = async (paymentId) => {
  try {
    console.log(`Verifying payment status for payment ${paymentId}...`);
    const response = await axios.get(`${API_URL}/payments/${paymentId}/status`);
    console.log("✅ Payment status verified:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "verify payment status");
  }
};

// ✅ Place an order with payment integration and redirection - Enhanced function
export const placeOrder = async (orderDetails, navigate) => {
  try {
    console.log("Placing order:", orderDetails);

    // Validate order details
    if (!orderDetails.user_id || !orderDetails.items || !orderDetails.payment_method) {
      throw new Error("Missing required fields: user_id, items, or payment_method");
    }

    // Step 1: Create the order
    const orderResponse = await axios.post(`${API_URL}/orders/`, orderDetails);
    console.log("✅ Order created successfully:", orderResponse.data);
    
    const orderId = orderResponse.data.id;
    
    // Step 2: Process the payment with redirection handling
    const paymentDetails = {
      order_id: orderId,
      amount: orderResponse.data.total_amount,
      payment_method: orderDetails.payment_method,
      user_id: orderDetails.user_id,
      details: orderDetails.payment_details || {},
      return_url: `${window.location.origin}/order-complete/${orderId}`
    };
    
    const paymentResponse = await processPayment(paymentDetails, (redirectUrl) => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    });
    
    console.log("✅ Payment initiated:", paymentResponse);
    
    if (navigate && typeof navigate === 'function') {
      navigate(`/order-tracking/${orderId}`, { 
        state: { 
          orderSummary: orderResponse.data,
          paymentDetails: paymentResponse
        }
      });
    } else {
      console.log("Navigation function not provided, cannot redirect automatically");
      return { 
        ...orderResponse.data, 
        payment: paymentResponse, 
        redirect_url: `/order-tracking/${orderId}` 
      };
    }
    
    return orderResponse.data;
  } catch (error) {
    return handleApiError(error, "place order with payment");
  }
};

// ✅ Get order summary - New function for order page
export const getOrderSummary = async (orderId) => {
  try {
    console.log(`Fetching order summary for order ${orderId}...`);
    const response = await axios.get(`${API_URL}/orders/${orderId}/summary`);
    console.log("✅ Order summary received:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetch order summary");
  }
};

// ✅ Get order status
export const getOrderStatus = async (userId) => {
  try {
    console.log(`Fetching order status for user ${userId}...`);
    const response = await axios.get(`${API_URL}/orders/status/${userId}`);
    console.log("✅ Order status received:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetch order status");
  }
};

// ✅ Get order details by ID - New function
export const getOrderById = async (orderId) => {
  try {
    console.log(`Fetching order details for order ${orderId}...`);
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    console.log("✅ Order details received:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetch order details");
  }
};

// ✅ Update order status - New function
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log(`Updating order ${orderId} status to ${status}...`);
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
    console.log("✅ Order status updated:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "update order status");
  }
};

// ✅ Get payment methods - Enhanced with redirect info
export const getPaymentMethods = async () => {
  try {
    console.log("Fetching available payment methods...");
    const response = await axios.get(`${API_URL}/payments/methods`);
    console.log("✅ Payment methods received:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "fetch payment methods");
  }
};

// ✅ Handle payment method selection and potential redirection
export const handlePaymentMethodSelection = async (paymentMethodId, orderId, amount, userId) => {
  try {
    console.log(`Setting up payment method ${paymentMethodId} for order ${orderId}...`);
    const response = await axios.post(`${API_URL}/payments/setup`, {
      payment_method_id: paymentMethodId,
      order_id: orderId,
      amount: amount,
      user_id: userId,
      return_url: `${window.location.origin}/order-complete/${orderId}`
    });
    
    console.log("✅ Payment method setup:", response.data);
    
    if (response.data.requires_redirect && response.data.redirect_url) {
      return {
        success: true,
        redirect: true,
        redirect_url: response.data.redirect_url
      };
    }
    
    return {
      success: true,
      redirect: false,
      payment_details: response.data
    };
  } catch (error) {
    return handleApiError(error, "set up payment method");
  }
};

// ✅ Get order summary with items and payment details for order page
export const getCompleteOrderSummary = async (orderId) => {
  try {
    console.log(`Fetching complete order summary for order ${orderId}...`);
    
    const orderResponse = await axios.get(`${API_URL}/orders/${orderId}`);
    const paymentResponse = await axios.get(`${API_URL}/payments/by-order/${orderId}`);
    
    const summary = {
      order: orderResponse.data,
      payment: paymentResponse.data,
      timestamps: {
        order_created: orderResponse.data.created_at,
        payment_processed: paymentResponse.data.processed_at,
        estimated_delivery: orderResponse.data.estimated_delivery_time
      }
    };
    
    console.log("✅ Complete order summary created:", summary);
    return summary;
  } catch (error) {
    return handleApiError(error, "fetch complete order summary");
  }
};

// ✅ Cancel order - New function
export const cancelOrder = async (orderId, reason) => {
  try {
    console.log(`Cancelling order ${orderId}...`);
    const response = await axios.post(`${API_URL}/orders/${orderId}/cancel`, { reason });
    console.log("✅ Order cancelled successfully:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "cancel order");
  }
};

// ✅ Fetch all feedback with robust error handling
export const fetchFeedback = async () => {
  try {
    console.log("Fetching feedback...");
    const response = await axios.get(`${API_URL}/feedback/`);
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      console.log("✅ Feedback received (array):", response.data.length, "entries");
      return response.data;
    }
    
    if (typeof response.data === 'object') {
      // Handle rating counts format {1: 5, 2: 3, ...}
      if ([1, 2, 3, 4, 5].some(rating => rating in response.data)) {
        console.log("✅ Rating count format received");
        const feedbackArray = [];
        for (let rating = 1; rating <= 5; rating++) {
          const count = response.data[rating] || 0;
          for (let i = 0; i < count; i++) {
            feedbackArray.push({
              rating,
              user_id: `user_${rating}_${i}`,
              feedback: `Feedback for rating ${rating}`,
              created_at: new Date().toISOString()
            });
          }
        }
        return feedbackArray;
      }
      
      // Handle object with feedback items
      console.log("✅ Feedback received (object):", response.data);
      return Object.values(response.data);
    }
    
    console.warn("Unexpected feedback format, returning empty array");
    return [];
  } catch (error) {
    console.warn("Error fetching feedback, returning empty array");
    return [];
  }
};

// ✅ Get comprehensive feedback analytics
export const getFeedbackAnalytics = async () => {
  try {
    console.log("Fetching feedback analytics...");
    const response = await axios.get(`${API_URL}/analytics/feedback`);
    
    // Ensure consistent response format
    const analytics = {
      total: response.data.total || 0,
      averageRating: response.data.average_rating || 0,
      ratingDistribution: response.data.rating_distribution || {1:0, 2:0, 3:0, 4:0, 5:0},
      positive: response.data.positive_count || 0,
      negative: response.data.negative_count || 0,
      recentFeedback: response.data.recent_feedback || []
    };
    
    console.log("✅ Feedback analytics received:", analytics);
    return analytics;
  } catch (error) {
    console.warn("Error fetching analytics, calculating manually...");
    
    // Fallback: Calculate analytics from raw feedback
    const feedbackData = await fetchFeedback();
    const ratingDistribution = {1:0, 2:0, 3:0, 4:0, 5:0};
    let total = feedbackData.length;
    let totalRating = 0;
    let positive = 0;
    let negative = 0;
    
    feedbackData.forEach(feedback => {
      const rating = parseInt(feedback.rating);
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating]++;
        totalRating += rating;
        if (rating >= 4) positive++;
        else if (rating <= 2) negative++;
      }
    });
    
    const averageRating = total > 0 ? (totalRating / total).toFixed(1) : 0;
    
    return {
      total,
      averageRating,
      ratingDistribution,
      positive,
      negative,
      recentFeedback: feedbackData.slice(0, 5)
    };
  }
};

// ✅ Submit feedback with improved validation
export const submitFeedback = async (feedbackData) => {
  try {
    console.log("Submitting feedback:", feedbackData);
    
    // Validate required fields
    if (!feedbackData.feedback || feedbackData.feedback.trim() === "") {
      throw new Error("Feedback text is required");
    }
    
    const rating = parseInt(feedbackData.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    
    const response = await axios.post(`${API_URL}/feedback/`, {
      user_id: feedbackData.user_id || "anonymous",
      rating,
      feedback: feedbackData.feedback
    });
    
    console.log("✅ Feedback submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "submit feedback");
  }
};

export default {
  fetchCategories,
  fetchInventory,
  fetchMenuItems,
  getPopularItems,
  addItem,
  updateItem,
  deleteItem,
  updateItemAvailability,
  processPayment,
  verifyPaymentStatus,
  placeOrder,
  getOrderSummary,
  getOrderStatus,
  getOrderById,
  updateOrderStatus,
  getPaymentMethods,
  handlePaymentMethodSelection,
  getCompleteOrderSummary,
  cancelOrder,
  fetchFeedback,
  getFeedbackAnalytics,
  submitFeedback
};