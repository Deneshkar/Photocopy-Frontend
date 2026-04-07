function AdminOrderTable({ orders, onStatusChange, updatingOrderId }) {
  return (
    <div className="panel overflow-x-auto p-5">
      <h2 className="font-display text-lg font-semibold text-slate-900">Order List</h2>

      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No orders found.</p>
      ) : (
        <table className="mt-4 min-w-full border-separate border-spacing-y-2">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Address</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Update Status</th>
            </tr>
          </thead>
          <tbody className="stagger-fade">
            {orders.map((order) => (
              <tr key={order._id} className="rounded-xl bg-paper-100 text-sm text-slate-700">
                <td className="rounded-l-xl px-3 py-3 font-medium">{order.customerName}</td>
                <td className="px-3 py-3">{order.phone}</td>
                <td className="px-3 py-3">{order.deliveryAddress}</td>
                <td className="px-3 py-3">
                  <div className="min-w-[180px]">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="mb-1 last:mb-0">
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 font-semibold">
                  Rs. {Number(order.totalPrice).toLocaleString()}
                </td>
                <td className="px-3 py-3">
                  <span className={`status-badge ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="rounded-r-xl px-3 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                    disabled={updatingOrderId === order._id}
                    className="input-ui h-10"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {updatingOrderId === order._id && (
                    <p className="mt-1 text-xs text-slate-500">Updating...</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const getStatusStyle = (status) => {
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "processing") return "bg-blue-100 text-blue-700";
  if (status === "completed") return "bg-mint-100 text-mint-500";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-paper-100 text-slate-600";
};

export default AdminOrderTable;
