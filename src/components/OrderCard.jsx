function OrderCard({ order }) {
  return (
    <article className="panel panel-hover p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-slate-900">
          Order #{order._id.slice(-8)}
        </h3>
        <span className={`status-badge ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
        <p className="sm:col-span-2"><strong>Address:</strong> {order.deliveryAddress}</p>
        <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
        <p>
          <strong>Order Date:</strong>{" "}
        {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-paper-200 bg-paper-100 p-3">
        <h4 className="text-sm font-semibold text-slate-700">Order Items</h4>
        {order.orderItems.map((item, index) => (
          <div key={index} className="mt-2 flex flex-wrap justify-between gap-2 border-b border-paper-200 pb-2 text-sm text-slate-600 last:border-b-0 last:pb-0">
            <span>{item.name}</span>
            <span>Qty: {item.quantity}</span>
            <span>Rs. {item.price}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

const getStatusStyle = (status) => {
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "processing") return "bg-blue-100 text-blue-700";
  if (status === "completed") return "bg-mint-100 text-mint-500";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-paper-100 text-slate-600";
};

export default OrderCard;
