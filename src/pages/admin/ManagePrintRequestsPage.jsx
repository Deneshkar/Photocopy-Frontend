import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import toast from "react-hot-toast";
import AdminPrintRequestTable from "../../components/AdminPrintRequestTable";

function ManagePrintRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRequestId, setUpdatingRequestId] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    customerName: "",
    printType: "",
    paperSize: "",
  });

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (filters.status) queryParams.append("status", filters.status);
      if (filters.customerName) {
        queryParams.append("customerName", filters.customerName);
      }
      if (filters.printType) queryParams.append("printType", filters.printType);
      if (filters.paperSize) queryParams.append("paperSize", filters.paperSize);

      const res = await API.get(`/print-requests?${queryParams.toString()}`);

      setRequests(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch print requests"
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters.customerName,
    filters.paperSize,
    filters.printType,
    filters.status,
  ]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      setUpdatingRequestId(requestId);

      await API.put(
        `/print-requests/${requestId}/status`,
        { status: newStatus }
      );

      toast.success("Print request status updated successfully");

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update print request status"
      );
    } finally {
      setUpdatingRequestId(null);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this print request?")) return;

    try {
      await API.delete(`/print-requests/${requestId}`);
      toast.success("Print request deleted successfully");
      
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete print request"
      );
    }
  };

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Manage Print Requests</h1>
        <button onClick={fetchRequests} className="btn-secondary">
          Refresh
        </button>
      </div>

      <p className="text-sm text-slate-600">
        Total Print Requests Found: <strong>{requests.length}</strong>
      </p>

      <div className="panel panel-hover grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="label-ui" htmlFor="request-customer">Customer</label>
          <input
            id="request-customer"
            type="text"
            name="customerName"
            placeholder="Search by customer name..."
            value={filters.customerName}
            onChange={handleFilterChange}
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-ui" htmlFor="request-status">Status</label>
          <select
            id="request-status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input-ui"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="printing">Printing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="label-ui" htmlFor="request-type">Print Type</label>
          <select
            id="request-type"
            name="printType"
            value={filters.printType}
            onChange={handleFilterChange}
            className="input-ui"
          >
            <option value="">All Print Types</option>
            <option value="black_white">Black & White</option>
            <option value="color">Color</option>
          </select>
        </div>

        <div>
          <label className="label-ui" htmlFor="request-size">Paper Size</label>
          <select
            id="request-size"
            name="paperSize"
            value={filters.paperSize}
            onChange={handleFilterChange}
            className="input-ui"
          >
            <option value="">All Paper Sizes</option>
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="Letter">Letter</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading print requests...</p>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <AdminPrintRequestTable
            requests={requests}
            onStatusChange={handleStatusChange}
            onDeleteRequest={handleDeleteRequest}
            updatingRequestId={updatingRequestId}
          />
        </motion.div>
      )}
    </div>
  );
}

export default ManagePrintRequestsPage;
