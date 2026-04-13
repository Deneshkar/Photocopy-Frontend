import { HiOutlineMinusSmall, HiOutlinePlusSmall, HiOutlineTrash } from "react-icons/hi2";

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="panel panel-hover flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base font-semibold text-slate-900">{item.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-slate-500">{item.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>Price: Rs. {item.price}</span>
          <span>Stock: {item.stock}</span>
          <span className="font-semibold text-brand-700">Subtotal: Rs. {item.price * item.quantity}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-secondary h-9 w-9 p-0" onClick={() => onDecrease(item._id)}>
          <HiOutlineMinusSmall className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
        <button className="btn-secondary h-9 w-9 p-0" onClick={() => onIncrease(item._id)}>
          <HiOutlinePlusSmall className="h-4 w-4" />
        </button>
        <button className="btn-danger ml-1 gap-1" onClick={() => onRemove(item._id)}>
          <HiOutlineTrash className="h-4 w-4" />
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
