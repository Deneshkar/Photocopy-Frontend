import { useCallback, useEffect, useState } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import API from "../../services/api";
import toast from "react-hot-toast";
import SummaryCard from "../../components/SummaryCard";
import StatusBox from "../../components/StatusBox";
import LowStockTable from "../../components/LowStockTable";

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [summaryRes, lowStockRes] = await Promise.all([
        API.get("/dashboard/summary"),
        API.get("/dashboard/low-stock"),
      ]);

      setSummary(summaryRes.data || {});
      setLowStockProducts(lowStockRes.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
      setSummary(null);
      setLowStockProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const revenue = summary?.totalRevenue
    ? Number(summary.totalRevenue).toLocaleString()
    : "0";

  const orderChartData = Object.entries(summary?.orders || {}).map(([key, value]) => ({
    name: key,
    value,
  }));

  const printChartData = Object.entries(summary?.printRequests || {}).map(([key, value]) => ({
    name: key,
    value,
  }));

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!summary) {
    return (
      <div className="panel p-6">
        <p className="text-sm text-slate-600">Failed to load dashboard data.</p>
        <button onClick={fetchDashboardData} className="btn-secondary mt-3">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Track print operations, sales, and stock health.</p>
        </div>

        <button onClick={fetchDashboardData} className="btn-secondary gap-1.5">
          <HiOutlineArrowPath className="h-4 w-4" />
          Refresh Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Users" value={summary.totalUsers || 0} />
        <SummaryCard title="Total Admins" value={summary.totalAdmins || 0} />
        <SummaryCard title="Total Customers" value={summary.totalCustomers || 0} />
        <SummaryCard title="Total Products" value={summary.totalProducts || 0} />
        <SummaryCard title="Total Orders" value={summary.totalOrders || 0} />
        <SummaryCard
          title="Total Print Requests"
          value={summary.totalPrintRequests || 0}
        />
        <SummaryCard title="Total Revenue" value={`Rs. ${revenue}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel h-80 p-5">
          <h3 className="font-display text-lg font-semibold text-slate-900">Orders by Status</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2f90f7" fill="#d9edff" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel h-80 p-5">
          <h3 className="font-display text-lg font-semibold text-slate-900">Print Requests by Status</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={printChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#21b27f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusBox title="Order Status Summary" data={summary.orders || {}} />
        <StatusBox
          title="Print Request Status Summary"
          data={summary.printRequests || {}}
        />
      </div>

      <LowStockTable products={lowStockProducts} />
    </div>
  );
}

export default AdminDashboardPage;
