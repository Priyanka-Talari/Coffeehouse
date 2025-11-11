import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  fetchMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateItemAvailability,
  addCategory,
  updateCategory,
  deleteCategory,
  getPopularItems
} from "../inventory_management/api";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaChartBar } from "react-icons/fa";

const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    description: "",
    is_available: true,
    category_id: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
          const itemsData = await fetchMenuItems(categoriesData[0].id, true);
          setMenuItems(itemsData);
        }
        const popularData = await getPopularItems();
        setPopularItems(popularData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(parseInt(categoryId));
    resetForms();
  };

  const handleItemFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setItemForm({ ...itemForm, [name]: files[0] });
      if (files[0]) {
        setImagePreview(URL.createObjectURL(files[0]));
      } else {
        setImagePreview(null);
      }
    } else if (type === "checkbox") {
      setItemForm({ ...itemForm, [name]: checked });
    } else if (name === "price") {
      setItemForm({ ...itemForm, [name]: parseFloat(value) || "" });
    } else {
      setItemForm({ ...itemForm, [name]: value });
    }
  };

  const handleAddOrUpdateItem = async () => {
    try {
      if (editItemId) {
        await updateMenuItem(editItemId, itemForm);
      } else {
        await addMenuItem(itemForm);
      }
      const updatedItems = await fetchMenuItems(selectedCategory, true);
      setMenuItems(updatedItems);
      resetForms();
    } catch (error) {
      console.error("Error adding/updating item:", error);
    }
  };

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setItemForm({ ...item });
    setShowAddItemForm(true);
    setImagePreview(item.image ? item.image : null);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItem(itemId);
        setMenuItems(menuItems.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleAvailabilityChange = async (itemId, isAvailable) => {
    try {
      await updateItemAvailability(itemId, isAvailable);
      setMenuItems(menuItems.map(item => item.id === itemId ? { ...item, is_available: isAvailable } : item));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const resetForms = () => {
    setItemForm({
      name: "",
      price: "",
      description: "",
      is_available: true,
      category_id: selectedCategory,
      image: null
    });
    setEditItemId(null);
    setShowAddItemForm(false);
    setImagePreview(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Menu Management</h2>

      {/* Category Selection */}
      <select value={selectedCategory || ""} onChange={(e) => handleCategoryChange(e.target.value)}
        className="p-2 border rounded mb-4">
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.category_name}</option>
        ))}
      </select>

      {/* Menu Items List */}
      {loading ? <p>Loading...</p> : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">${item.price}</td>
                <td className="border p-2">
                  <button onClick={() => handleAvailabilityChange(item.id, !item.is_available)}
                    className={`px-2 py-1 text-white ${item.is_available ? "bg-green-500" : "bg-red-500"}`}>
                    {item.is_available ? "In Stock" : "Out of Stock"}
                  </button>
                </td>
                <td className="border p-2">
                  <button onClick={() => handleEditItem(item)} className="text-blue-500 mx-2"><FaEdit /></button>
                  <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 mx-2"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit Item Form */}
      {showAddItemForm && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">{editItemId ? "Edit Item" : "Add New Item"}</h3>
          <input type="text" name="name" placeholder="Item Name" value={itemForm.name} onChange={handleItemFormChange}
            className="w-full p-2 border rounded mt-2" />
          <input type="number" name="price" placeholder="Price" value={itemForm.price} onChange={handleItemFormChange}
            className="w-full p-2 border rounded mt-2" />
          <input type="file" name="image" onChange={handleItemFormChange} className="mt-2" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover" />}
          <button onClick={handleAddOrUpdateItem} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
            {editItemId ? "Update Item" : "Add Item"}
          </button>
        </div>
      )}

      <button onClick={() => setShowAddItemForm(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        <FaPlus /> Add Item
      </button>
    </div>
  );
};

export default AdminMenu;
