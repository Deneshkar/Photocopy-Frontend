import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  HiOutlineFunnel, 
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlinePrinter,
  HiOutlineDocumentDuplicate,
  HiOutlineDocument,
  HiOutlineClipboardDocumentList 
} from "react-icons/hi2";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";



const floatingItems = [
  { id: 1, Icon: HiOutlineDocumentDuplicate, top: "10%", left: "5%", size: 64, delay: 0 },
  { id: 2, Icon: HiOutlinePrinter, top: "40%", left: "85%", size: 86, delay: 1.5 },
  { id: 3, Icon: HiOutlineDocumentText, top: "80%", left: "15%", size: 48, delay: 0.5 },
  { id: 4, Icon: HiOutlineDocument, top: "20%", left: "75%", size: 54, delay: 2 },
  { id: 5, Icon: HiOutlineClipboardDocumentList, top: "60%", left: "50%", size: 72, delay: 1 },
];

function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    isAvailable: "",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.isAvailable) queryParams.append("isAvailable", filters.isAvailable);

      const res = await API.get(`/products?${queryParams.toString()}`);
      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.isAvailable, filters.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative min-h-[calc(100vh-9rem)] overflow-hidden bg-gradient-to-br from-slate-50 to-brand-50/30">
      {/* Floating Elements Background */}
      {floatingItems.map((item) => (
        <motion.div
          key={item.id}
          className="pointer-events-none absolute z-0 text-brand-600/10"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}

      <div className="page-shell relative z-10 space-y-6 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="page-title">Stationery Store</h1>
            <p className="page-subtitle">Books, pens, and essentials for every print job.</p>
          </div>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold tracking-wide text-brand-700 shadow-sm backdrop-blur-md">
            {products.length} items found
          </span>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/70 p-5 shadow-lg backdrop-blur-xl">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="label-ui" htmlFor="search">Search</label>
              <div className="relative">
                <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="search"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="label-ui" htmlFor="category">Category</label>
              <select
                id="category"
                className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                name="category"
                value={filters.category}
                onChange={handleChange}
              >
                <option value="">All Categories</option>
                <option value="book">Book</option>
                <option value="pen">Pen</option>
                <option value="accessory">Accessory</option>
                <option value="stationery">Stationery</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label-ui" htmlFor="isAvailable">Availability</label>
              <div className="relative">
                <HiOutlineFunnel className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="isAvailable"
                  className="block w-full appearance-none rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  name="isAvailable"
                  value={filters.isAvailable}
                  onChange={handleChange}
                >
                  <option value="">All Status</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/50 bg-white/70 p-8 text-center text-sm font-medium text-slate-500 shadow-lg backdrop-blur-xl">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/50 bg-white/70 p-8 text-center text-sm font-medium text-slate-500 shadow-lg backdrop-blur-xl">No products found.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="stagger-fade grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
