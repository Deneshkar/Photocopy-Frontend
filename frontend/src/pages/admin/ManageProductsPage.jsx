import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import toast from "react-hot-toast";
import AdminProductForm from "../../components/AdminProductForm";
import AdminProductTable from "../../components/AdminProductTable";

function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setFetching(true);

      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.category) queryParams.append("category", filters.category);

      const res = await API.get(`/products?${queryParams.toString()}`);
      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setFetching(false);
    }
  }, [filters.category, filters.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (formData) => {
    if (
      !formData.name ||
      !formData.description ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", Number(formData.price));
      submitData.append("category", formData.category);
      submitData.append("stock", Number(formData.stock));
      submitData.append("isAvailable", formData.isAvailable);

      if (formData.imageFile) {
        submitData.append("file", formData.imageFile);
      }

      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, submitData);
        toast.success("Product updated successfully");
        setEditProduct(null);
      } else {
        await API.post("/products", submitData);
        toast.success("Product added successfully");
      }

      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${productId}`);

      toast.success("Product deleted successfully");
      fetchProducts();

      if (editProduct && editProduct._id === productId) {
        setEditProduct(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
  };

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Manage Products</h1>
        <button onClick={fetchProducts} className="btn-secondary">Refresh</button>
      </div>

      <AdminProductForm
        key={editProduct ? `edit-${editProduct._id}` : "new"}
        onSubmit={handleSubmit}
        loading={loading}
        editProduct={editProduct}
        onCancel={handleCancelEdit}
      />

      <div className="panel panel-hover grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <label className="label-ui" htmlFor="product-search">Search</label>
          <input
            id="product-search"
            className="input-ui"
            type="text"
            name="search"
            placeholder="Search by product name..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label className="label-ui" htmlFor="product-category">Category</label>
          <select
            id="product-category"
            className="input-ui"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="book">Book</option>
            <option value="pen">Pen</option>
            <option value="accessory">Accessory</option>
            <option value="stationery">Stationery</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {fetching ? (
        <p>Loading products...</p>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <AdminProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      )}
    </div>
  );
}

export default ManageProductsPage;
