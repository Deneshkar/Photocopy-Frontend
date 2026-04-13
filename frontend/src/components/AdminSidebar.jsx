import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBanknotes,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentDuplicate,
  HiOutlineShoppingBag,
  HiOutlineUsers,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: HiOutlineChartBar },
    { to: "/admin/products", label: "Products", icon: HiOutlineShoppingBag },
    { to: "/admin/orders", label: "Orders", icon: HiOutlineClipboardDocumentList },
    {
      to: "/admin/print-requests",
      label: "Print Requests",
      icon: HiOutlineDocumentDuplicate,
    },
    {
      to: "/admin/profit-management",
      label: "Profit Management",
      icon: HiOutlineBanknotes,
    },
    { to: "/admin/users", label: "Users", icon: HiOutlineUsers },
  ];

  return (
    <aside className="sticky top-0 hidden min-h-screen w-72 shrink-0 bg-dark-800 p-5 lg:block">
      <div>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-white">Sahana Photocopy</h2>
          <p className="mt-1 text-xs text-dark-400">Admin Operations Panel</p>
        </div>

        <div className="rounded-lg border border-dark-700 bg-dark-700 p-4">
          <p className="text-xs text-dark-400">Logged in as</p>
          <h3 className="mt-1 text-sm font-semibold text-white">{user?.name || "Admin"}</h3>
          <p className="mt-1 truncate text-xs text-dark-400">{user?.email}</p>
        </div>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-600 text-white"
                      : "text-dark-300 hover:bg-dark-700 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dark-600 bg-dark-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300/30 hover:bg-dark-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
      >
        <HiOutlineArrowRightOnRectangle className="h-4 w-4 text-dark-300 transition group-hover:text-white" />
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
