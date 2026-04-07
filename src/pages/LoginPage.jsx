import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineLockClosed, 
  HiOutlineEnvelope,
  HiOutlineDocumentText,
  HiOutlinePrinter,
  HiOutlineDocumentDuplicate,
  HiOutlinePhoto
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Floating Elements Component
const FloatingElements = () => {
  const elements = [
    { Icon: HiOutlineDocumentText, size: 40, x: "10%", y: "20%", duration: 15, delay: 0 },
    { Icon: HiOutlinePrinter, size: 60, x: "85%", y: "15%", duration: 18, delay: 2 },
    { Icon: HiOutlineDocumentDuplicate, size: 45, x: "75%", y: "80%", duration: 20, delay: 1 },
    { Icon: HiOutlinePhoto, size: 50, x: "15%", y: "75%", duration: 17, delay: 3 },
    { Icon: HiOutlineDocumentText, size: 35, x: "50%", y: "10%", duration: 22, delay: 4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-brand-500"
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear",
          }}
        >
          <el.Icon size={el.size} />
        </motion.div>
      ))}
    </div>
  );
};

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const loggedInUser = await login(formData);

      toast.success("Login successful");

      if (loggedInUser?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 overflow-hidden page-shell">
      <FloatingElements />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 sm:p-10 panel glass-panel panel-hover panel-soft-glow z-10 relative isolate overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50/50 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-brand-100/50 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-100/50 blur-3xl"></div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30"
          >
            <HiOutlinePrinter className="w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-slate-500 text-sm font-medium">Sign in to manage your print jobs and orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
          >
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <div className="relative group">
              <HiOutlineEnvelope className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-600" />
              <input
                id="email"
                className="input-ui pl-11 py-2.5 w-full rounded-xl border-slate-200 bg-white/60 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
          >
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative group">
              <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-600" />
              <input
                id="password"
                className="input-ui pl-11 py-2.5 w-full rounded-xl border-slate-200 bg-white/60 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          <motion.button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full py-3 rounded-xl font-semibold shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all flex justify-center mt-2 group relative overflow-hidden"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="relative z-10">{loading ? "Signing in..." : "Login to Workspace"}</span>
            {!loading && <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-[shimmer_1.5s_infinite] z-0"></div>}
          </motion.button>
        </form>

        <motion.p 
          className="mt-6 text-center text-sm font-medium text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800 underline-offset-4 hover:underline transition-all">
            Register now
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
