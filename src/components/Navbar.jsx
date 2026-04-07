import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentArrowUp,
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const totalCartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const customerLinks = [
    { to: "/", label: "Home", icon: HiOutlineHome },
    { to: "/products", label: "Products", icon: HiOutlineShoppingBag },
    {
      to: "/print-request",
      label: "Print Request",
      icon: HiOutlineDocumentArrowUp,
    },
    { to: "/my-orders", label: "My Orders", icon: HiOutlineClipboardDocumentList },
    {
      to: "/my-print-requests",
      label: "Print Jobs",
      icon: HiOutlineSquares2X2,
    },
  ];

  const publicLinks = [
    { to: "/", label: "Home", icon: HiOutlineHome },
    { to: "/products", label: "Products", icon: HiOutlineShoppingBag },
  ];

  const linksToRender = user?.role === "customer" ? customerLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex min-h-[4.15rem] flex-wrap items-center justify-between gap-3 py-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-brand-100 p-2 text-brand-700 shadow-sm">
            <HiOutlineDocumentArrowUp className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-slate-900">
              Sahana Photocopy
            </p>
            <p className="text-xs text-slate-500">Photocopy & Stationery Services</p>
          </div>
        </Link>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          {linksToRender.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-100 text-brand-700"
                      : "text-slate-600 hover:bg-paper-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}

          {user?.role === "customer" && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive || location.pathname === "/cart"
                    ? "bg-mint-100 text-mint-500"
                    : "bg-mint-50 text-mint-500 hover:bg-mint-100"
                }`
              }
            >
              <HiOutlineShoppingCart className="h-4 w-4" />
              Cart
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-700">
                {totalCartCount}
              </span>
            </NavLink>
          )}

          {!user && (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Create Account
              </Link>
            </>
          )}

          {user?.role === "customer" && (
            <button onClick={handleLogout} className="btn-secondary gap-1.5">
              <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
