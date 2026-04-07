import { useState } from "react";
import { buildFileUrl } from "../services/api";

const initialState = {
  name: "",
  description: "",
  price: "",
  category: "book",
  stock: "",
  image: "",
  imageFile: null,
  isAvailable: true,
};

const createFormState = (product) =>
  product
    ? {
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "book",
        stock: product.stock || "",
        image: product.image || "",
        imageFile: null,
        isAvailable:
          typeof product.isAvailable === "boolean" ? product.isAvailable : true,
      }
    : initialState;

const createPreview = (product) =>
  product?.image ? buildFileUrl(product.image) : "";

function AdminProductForm({ onSubmit, loading, editProduct, onCancel }) {
  const [formData, setFormData] = useState(() => createFormState(editProduct));
  const [preview, setPreview] = useState(() => createPreview(editProduct));
  const actionLabel = loading
    ? editProduct
      ? "Updating..."
      : "Adding..."
    : editProduct
    ? "Update Product"
    : "Add Product";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editProduct) {
      setFormData(initialState);
      setPreview("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel panel-hover panel-soft-glow mb-5 space-y-4 p-5">
      <h2 className="font-display text-lg font-semibold text-slate-900">
        {editProduct ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label-ui" htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            className="input-ui"
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label-ui" htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            className="textarea-ui"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div>
          <label className="label-ui" htmlFor="product-price">Price</label>
          <input
            id="product-price"
            className="input-ui"
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label className="label-ui" htmlFor="product-stock">Stock</label>
          <input
            id="product-stock"
            className="input-ui"
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label className="label-ui" htmlFor="product-category">Category</label>
          <select
            id="product-category"
            className="input-ui"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="book">Book</option>
            <option value="pen">Pen</option>
            <option value="accessory">Accessory</option>
            <option value="stationery">Stationery</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="label-ui" htmlFor="product-image">Image</label>
          <input id="product-image" className="input-ui py-2" type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>

      {preview && (
        <div className="rounded-xl border border-paper-200 bg-paper-100 p-3">
          <img src={preview} alt="Preview" className="h-28 w-28 rounded-lg object-cover" />
        </div>
      )}

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        Available
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {actionLabel}
        </button>

        {editProduct && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AdminProductForm;
