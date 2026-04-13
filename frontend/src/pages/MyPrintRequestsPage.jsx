import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import API, { buildFileUrl } from "../services/api";
import toast from "react-hot-toast";

function MyPrintRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/print-requests/my-requests");

      setRequests(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">My Print Requests</h1>
          <p className="page-subtitle">Monitor every uploaded document and its print status.</p>
        </div>
        <button onClick={fetchRequests} className="btn-secondary">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="panel p-6 text-sm text-slate-500">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="panel p-8 text-center">
          <h2 className="font-display text-lg font-semibold text-slate-900">No Requests Yet</h2>
          <p className="mt-1 text-sm text-slate-500">You haven&apos;t submitted any print requests.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="stagger-fade grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {requests.map((request) => (
            <article key={request._id} className="panel panel-hover p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Request #{request._id.slice(-6)}
                </h3>
                <span className={`status-badge ${getStatusStyle(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <p className="text-sm text-slate-600"><strong>File:</strong> {request.originalFileName}</p>

              <p className="mt-1 text-sm">
                <a
                  href={buildFileUrl(request.file)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-700 hover:text-brand-800"
                >
                  View File
                </a>
              </p>

              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <p><strong>Copies:</strong> {request.copies}</p>
                <p><strong>Type:</strong> {request.printType}</p>
                <p><strong>Size:</strong> {request.paperSize}</p>
                <p><strong>Sides:</strong> {request.sides}</p>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </motion.div>
      )}
    </div>
  );
}

const getStatusStyle = (status) => {
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "accepted") return "bg-blue-100 text-blue-700";
  if (status === "printing") return "bg-violet-100 text-violet-700";
  if (status === "completed") return "bg-mint-100 text-mint-500";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-paper-100 text-slate-600";
};

export default MyPrintRequestsPage;
