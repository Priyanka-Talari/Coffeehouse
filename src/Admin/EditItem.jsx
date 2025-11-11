import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: "",
    price: 0,
    quantity: 0,
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/items/${id}/`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
        alert("Failed to load item details. Please try again.");
      }
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/items/${id}/`, item);
      alert("Item updated successfully!");
      navigate("/admin/inventory");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleAvailabilityChange = () => {
    setItem((prevItem) => ({
      ...prevItem,
      isAvailable: !prevItem.isAvailable,
    }));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Item</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Price:</label>
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Image URL:</label>
          <input
            type="text"
            name="image"
            value={item.image}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={item.isAvailable}
              onChange={handleAvailabilityChange}
              className="mr-2"
            />
            <span className="font-semibold">Available</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition-all duration-200"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditItem;
