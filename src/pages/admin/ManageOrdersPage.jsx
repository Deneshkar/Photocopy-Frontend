import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import toast from "react-hot-toast";
import AdminOrderTable from "../../components/AdminOrderTable";

function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    customerName: "",
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (filters.status) {
        queryParams.append("status", filters.status);
      }

      if (filters.customerName) {
        queryParams.append("customerName", filters.customerName);
      }

      const res = await API.get(`/orders?${queryParams.toString()}`);

      setOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [filters.customerName, filters.status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);

      await API.put(
        `/orders/${orderId}/status`,
        { status: newStatus }
      );

      toast.success("Order status updated successfully");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Manage Orders</h1>
        <button onClick={fetchOrders} className="btn-secondary">
          Refresh
        </button>
      </div>

      <p className="text-sm text-slate-600">
        Total Orders Found: <strong>{orders.length}</strong>
      </p>

      <div className="panel panel-hover grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <label className="label-ui" htmlFor="order-customer">Customer</label>
          <input
            id="order-customer"
            type="text"
            name="customerName"
            placeholder="Search by customer name..."
            value={filters.customerName}
            onChange={handleFilterChange}
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-ui" htmlFor="order-status">Status</label>
          <select
            id="order-status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input-ui"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <AdminOrderTable
            orders={orders}
            onStatusChange={handleStatusChange}
            updatingOrderId={updatingOrderId}
          />
        </motion.div>
      )}
    </div>
  );
}

export default ManageOrdersPage;
