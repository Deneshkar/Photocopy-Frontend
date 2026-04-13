function LowStockTable({ products }) {
  return (
    <div className="panel overflow-x-auto p-5">
      <h2 className="font-display text-lg font-semibold text-slate-900">Low Stock Products</h2>

      {products.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No low stock products found.</p>
      ) : (
        <table className="mt-4 min-w-full border-separate border-spacing-y-2">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Product Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Availability</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="rounded-xl bg-paper-100 text-sm text-slate-700">
                <td className="rounded-l-xl px-3 py-3 font-medium">{product.name}</td>
                <td className="px-3 py-3 capitalize">{product.category}</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {product.stock}
                  </span>
                </td>
                <td className="px-3 py-3 font-semibold">Rs. {product.price}</td>
                <td className="rounded-r-xl px-3 py-3">
                  <span
                    className={`status-badge ${
                      product.isAvailable
                        ? "bg-mint-100 text-mint-500"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LowStockTable;
