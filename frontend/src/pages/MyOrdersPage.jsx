import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import toast from "react-hot-toast";
import OrderCard from "../components/OrderCard";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/orders/my-orders");

      setOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track status of your stationery purchases.</p>
      </div>

      {loading ? (
        <div className="panel p-6 text-sm text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="panel p-6 text-sm text-slate-500">You have no orders yet.</div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="stagger-fade space-y-3"
        >
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default MyOrdersPage;
