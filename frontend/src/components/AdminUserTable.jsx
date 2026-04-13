function AdminUserTable({
  users,
  currentUser,
  onRoleChange,
  onDelete,
  updatingUserId,
  deletingUserId,
}) {
  return (
    <div className="panel overflow-x-auto p-5">
      <h2 className="font-display text-lg font-semibold text-slate-900">User List</h2>

      {users.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No users found.</p>
      ) : (
        <table className="mt-4 min-w-full border-separate border-spacing-y-2">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Joined Date</th>
              <th className="px-3 py-2">Update Role</th>
              <th className="px-3 py-2">Delete</th>
            </tr>
          </thead>
          <tbody className="stagger-fade">
            {users.map((user) => {
              const isCurrentUser = currentUser?._id === user._id;

              return (
                <tr key={user._id} className="rounded-xl bg-paper-100 text-sm text-slate-700">
                  <td className="rounded-l-xl px-3 py-3 font-medium">{user.name}</td>
                  <td className="px-3 py-3">{user.email}</td>
                  <td className="px-3 py-3">
                    <span className={`status-badge ${getRoleStyle(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="px-3 py-3">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => onRoleChange(user._id, e.target.value)}
                      disabled={updatingUserId === user._id || isCurrentUser}
                      className="input-ui h-10"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>

                    {isCurrentUser && (
                      <p className="mt-1 text-xs text-slate-500">Your account</p>
                    )}

                    {updatingUserId === user._id && (
                      <p className="mt-1 text-xs text-slate-500">Updating...</p>
                    )}
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    <button
                      onClick={() => onDelete(user._id)}
                      disabled={deletingUserId === user._id || isCurrentUser}
                      className="btn-danger"
                    >
                      {deletingUserId === user._id ? "Deleting..." : "Delete"}
                    </button>

                    {isCurrentUser && (
                      <p className="mt-1 text-xs text-slate-500">Cannot delete yourself</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const getRoleStyle = (role) => {
  return role === "admin" ? "bg-brand-100 text-brand-700" : "bg-paper-200 text-slate-700";
};

export default AdminUserTable;
