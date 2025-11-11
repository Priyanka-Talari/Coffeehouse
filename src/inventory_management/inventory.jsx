import React, { useState, useEffect } from "react";
import { fetchInventory, addItem, updateItem, deleteItem } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [isAvailable, setIsAvailable] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInventory();
      setItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      const quantityValue = parseInt(quantity, 10);
      const priceValue = parseFloat(unitPrice);
      const thresholdValue = parseInt(lowStockThreshold, 10);

      if (!name.trim()) throw new Error("Item name is required");
      if (isNaN(quantityValue)) throw new Error("Enter a valid quantity");
      if (isNaN(priceValue)) throw new Error("Enter a valid price");

      const payload = {
        name: name.trim(),
        quantity: quantityValue,
        category: category.trim() || null,
        unit_price: priceValue,
        low_stock_threshold: thresholdValue,
        is_available: isAvailable,
      };

      if (editingItem) {
        await updateItem(editingItem.id, payload);
        toast.success("Item updated successfully!");
      } else {
        await addItem(payload);
        toast.success("Item added successfully!");
      }

      resetForm();
      fetchItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setName("");
    setQuantity("");
    setCategory("");
    setUnitPrice("");
    setLowStockThreshold("5");
    setIsAvailable(true);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity.toString());
    setCategory(item.category || "");
    setUnitPrice(item.unit_price.toString());
    setLowStockThreshold(item.low_stock_threshold.toString());
    setIsAvailable(item.is_available);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(id);
      toast.success("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatPrice = (price) => `₹${parseFloat(price).toFixed(2)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-20">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-4xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Inventory Management</h2>

        {/* Input Form */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Unit Price (₹)"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Low Stock Threshold"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="mr-2"
              />
              <label>Available</label>
            </div>
            <div className="md:col-span-3 flex space-x-2">
              <button
                onClick={handleAddOrUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {editingItem ? "Update" : "Add"}
              </button>
              {editingItem && (
                <button
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
            <button
              onClick={fetchItems}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Item Name</th>
                  <th className="border p-3">Quantity</th>
                  <th className="border p-3">Category</th>
                  <th className="border p-3">Unit Price</th>
                  <th className="border p-3">Low Stock</th>
                  <th className="border p-3">Available</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={`border ${
                      item.quantity <= item.low_stock_threshold ? "bg-yellow-100" : ""
                    }`}
                  >
                    <td className="border p-3">{item.name}</td>
                    <td className="border p-3">{item.quantity}</td>
                    <td className="border p-3">{item.category || "-"}</td>
                    <td className="border p-3">{formatPrice(item.unit_price)}</td>
                    <td className="border p-3">{item.low_stock_threshold}</td>
                    <td className="border p-3">{item.is_available ? "Yes" : "No"}</td>
                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;