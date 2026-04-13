import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import CartItem from "../components/CartItem";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    phone: "",
    deliveryAddress: "",
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return toast.error("Your cart is empty");
    }

    if (!formData.customerName || !formData.phone || !formData.deliveryAddress) {
      return toast.error("Please fill all order details");
    }

    try {
      setLoading(true);

      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        deliveryAddress: formData.deliveryAddress,
        orderItems: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };

      await API.post("/orders", orderData);

      toast.success("Order placed successfully");
      clearCart();
      navigate("/my-orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div>
        <h1 className="page-title">Cart & Checkout</h1>
        <p className="page-subtitle">Review your stationery order before placing it.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-slate-500">Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="space-y-4">
            <div className="panel panel-hover p-5">
              <h2 className="font-display text-lg font-semibold text-slate-900">Order Summary</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p className="flex justify-between"><span>Total Items</span><strong>{cartItems.length}</strong></p>
                <p className="flex justify-between"><span>Total Price</span><strong>Rs. {totalPrice}</strong></p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="panel panel-hover space-y-4 p-5">
              <h2 className="font-display text-lg font-semibold text-slate-900">Customer Details</h2>

              <div>
                <label htmlFor="customerName" className="label-ui">Customer Name</label>
                <input
                  id="customerName"
                  className="input-ui"
                  type="text"
                  name="customerName"
                  placeholder="Customer Name"
                  value={formData.customerName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="label-ui">Phone Number</label>
                <input
                  id="phone"
                  className="input-ui"
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="deliveryAddress" className="label-ui">Delivery Address</label>
                <textarea
                  id="deliveryAddress"
                  className="textarea-ui"
                  name="deliveryAddress"
                  placeholder="Delivery Address"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
                <HiOutlineClipboardDocumentCheck className="h-4 w-4" />
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
