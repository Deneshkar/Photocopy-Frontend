import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyPrintRequestsPage from "./pages/MyPrintRequestsPage";
import PrintRequestPage from "./pages/PrintRequestPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageProductsPage from "./pages/admin/ManageProductsPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
import ManagePrintRequestsPage from "./pages/admin/ManagePrintRequestsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const appShellClass = "min-h-screen bg-slate-100 text-slate-900";

  return (
    <div
      className={appShellClass}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!rounded-xl !border !border-paper-200 !bg-white !text-slate-700",
          success: {
            iconTheme: { primary: "#21b27f", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
          },
        }}
      />

      {!isAdminPage && <Navbar />}

      <main className={isAdminPage ? "" : "container-shell pb-16 pt-6"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/print-request"
            element={
              <ProtectedRoute>
                <PrintRequestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-print-requests"
            element={
              <ProtectedRoute>
                <MyPrintRequestsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ManageProductsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ManageOrdersPage />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/print-requests"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ManagePrintRequestsPage />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ManageUsersPage />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
