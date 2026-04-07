import { motion } from "framer-motion";
import { HiOutlineCheckBadge, HiOutlineShoppingCart, HiOutlineXCircle } from "react-icons/hi2";
import { buildFileUrl } from "../services/api";

function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = !product.isAvailable || product.stock <= 0;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="panel panel-hover overflow-hidden"
    >
      <div className="relative h-44 overflow-hidden bg-paper-100">
        {product.image ? (
          <img
            src={buildFileUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No Image</div>
        )}

        <span
          className={`absolute left-3 top-3 status-badge ${
            isOutOfStock ? "bg-red-100 text-red-700" : "bg-mint-100 text-mint-500"
          }`}
        >
          {isOutOfStock ? "Out of stock" : "In stock"}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>
          </div>
          <p className="text-lg font-bold text-brand-700">Rs. {product.price}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="rounded-full bg-paper-100 px-2.5 py-1 capitalize">{product.category}</span>
          <span>Stock: {product.stock}</span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="btn-primary w-full gap-2"
        >
          {isOutOfStock ? <HiOutlineXCircle className="h-4 w-4" /> : <HiOutlineShoppingCart className="h-4 w-4" />}
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>

        {!isOutOfStock && (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-mint-500">
            <HiOutlineCheckBadge className="h-4 w-4" />
            Ready for purchase
          </p>
        )}
      </div>
    </motion.article>
  );
}

export default ProductCard;
