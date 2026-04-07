import { buildFileUrl } from "../services/api";

function AdminProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="panel overflow-x-auto p-5">
      <h2 className="font-display text-lg font-semibold text-slate-900">Product List</h2>

      {products.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No products found.</p>
      ) : (
        <table className="mt-4 min-w-full border-separate border-spacing-y-2">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Available</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="stagger-fade">
            {products.map((product) => (
              <tr key={product._id} className="rounded-xl bg-paper-100 text-sm text-slate-700">
                <td className="rounded-l-xl px-3 py-3">
                  {product.image ? (
                    <img
                      src={buildFileUrl(product.image)}
                      alt={product.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-3 py-3 font-medium">{product.name}</td>
                <td className="px-3 py-3 capitalize">{product.category}</td>
                <td className="px-3 py-3 font-semibold">Rs. {product.price}</td>
                <td className="px-3 py-3">{product.stock}</td>
                <td className="px-3 py-3">
                  <span
                    className={`status-badge ${
                      product.isAvailable
                        ? "bg-mint-100 text-mint-500"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isAvailable ? "Yes" : "No"}
                  </span>
                </td>
                <td className="rounded-r-xl px-3 py-3">
                  <button className="btn-secondary" onClick={() => onEdit(product)}>Edit</button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="btn-danger ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProductTable;
