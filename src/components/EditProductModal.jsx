import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import api from "../api/client";
import { toast } from "react-hot-toast";

export default function EditProductModal({ isOpen, onClose, onSuccess, product }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    description: "",
    altName: [],
    price: "",
    labelledPrice: "",
    category: "others",
    image: [],
    isVisible: true,
    brand: "generic",
    model: "standard",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.productId || "",
        name: product.name || "",
        description: product.description || "",
        altName: product.altName || [],
        price: product.price?.toString() || "",
        labelledPrice: product.labelledPrice?.toString() || "",
        category: product.category || "others",
        image: product.image || [],
        isVisible: product.isVisible !== undefined ? product.isVisible : true,
        brand: product.brand || "generic",
        model: product.model || "standard",
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAltNameChange = (index, value) => {
    const newAltNames = [...formData.altName];
    newAltNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      altName: newAltNames,
    }));
  };

  const addAltName = () => {
    setFormData((prev) => ({
      ...prev,
      altName: [...prev.altName, ""],
    }));
  };

  const removeAltName = (index) => {
    const newAltNames = formData.altName.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      altName: newAltNames,
    }));
  };

  const handleImageUploaded = (imagePaths) => {
    const paths = Array.isArray(imagePaths) ? imagePaths : [imagePaths];
    setFormData((prev) => ({
      ...prev,
      image: [...prev.image, ...paths],
    }));
  };

  const removeImage = (index) => {
    const newImages = formData.image.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      image: newImages,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.description) {
      toast.error("Please fill in all required fields: Name, Price, and Description");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const productData = {
        name: formData.name,
        description: formData.description,
        altName: formData.altName.filter(name => name.trim() !== ""),
        price: parseFloat(formData.price),
        labelledPrice: formData.labelledPrice ? parseFloat(formData.labelledPrice) : null,
        category: formData.category,
        image: formData.image.length > 0 ? formData.image : ["/images/default-product.png"],
        isVisible: formData.isVisible,
        brand: formData.brand,
        model: formData.model,
      };

      await api.put(`/products/${formData.productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onClose();
      onSuccess();
      toast.success("Product updated successfully!", { icon: "✏️" });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

        <div className="space-y-4">
          {/* Product ID (Read-only) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product ID
            </label>
            <input
              type="text"
              value={formData.productId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Alternative Names */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Alternative Names</label>
            {formData.altName.map((altName, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={altName}
                  onChange={(e) => handleAltNameChange(index, e.target.value)}
                  placeholder={`Alternative name ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => removeAltName(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAltName}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              + Add Alternative Name
            </button>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Labelled Price (Original)
              </label>
              <input
                type="number"
                name="labelledPrice"
                value={formData.labelledPrice}
                onChange={handleInputChange}
                placeholder="Enter original price"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="others">Others</option>
              <option value="laptops">Laptops</option>
              <option value="mice">Mice</option>
              <option value="keyboards">Keyboards</option>
              <option value="monitors">Monitors</option>
              <option value="accessories">Accessories</option>
              <option value="desktops">Desktops</option>
              <option value="components">Components</option>
            </select>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="Enter model"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Product Images</label>
            <ImageUpload onImageUploaded={handleImageUploaded} />
            {formData.image.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.image.map((imagePath, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imagePath.startsWith('/images') ? `http://localhost:3000${imagePath}` : imagePath}
                        alt={`Product ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Is Visible */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              id="isVisibleEdit"
            />
            <label htmlFor="isVisibleEdit" className="ml-2 text-gray-700 font-medium">
              Product is visible to customers
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update Product"}
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
