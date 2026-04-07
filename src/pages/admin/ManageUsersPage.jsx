import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import AdminUserTable from "../../components/AdminUserTable";

function ManageUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.role) queryParams.append("role", filters.role);

      const res = await API.get(`/users?${queryParams.toString()}`);

      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [filters.role, filters.search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);

      await API.put(
        `/users/${userId}`,
        { role: newRole }
      );

      toast.success("User role updated successfully");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);

      await API.delete(`/users/${userId}`);

      toast.success("User deleted successfully");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Manage Users</h1>
        <button onClick={fetchUsers} className="btn-secondary">
          Refresh
        </button>
      </div>

      <p className="text-sm text-slate-600">
        Total Users Found: <strong>{users.length}</strong>
      </p>

      <div className="panel panel-hover grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <label className="label-ui" htmlFor="search-users">Search</label>
          <input
            id="search-users"
            type="text"
            name="search"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={handleFilterChange}
            className="input-ui"
          />
        </div>

        <div>
          <label className="label-ui" htmlFor="role-filter">Role</label>
          <select
            id="role-filter"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="input-ui"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <AdminUserTable
            users={users}
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            onDelete={handleDelete}
            updatingUserId={updatingUserId}
            deletingUserId={deletingUserId}
          />
        </motion.div>
      )}
    </div>
  );
}

export default ManageUsersPage;
