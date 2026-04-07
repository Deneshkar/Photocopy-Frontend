import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HiOutlineArrowRight, 
  HiOutlineDocumentDuplicate, 
  HiOutlineInboxStack, 
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlinePrinter,
  HiOutlineDocument,
  HiOutlineClipboardDocumentList 
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";



const floatingItems = [
  { id: 1, Icon: HiOutlineDocumentText, top: "10%", left: "5%", size: 40, delay: 0 },
  { id: 2, Icon: HiOutlinePrinter, top: "25%", left: "85%", size: 60, delay: 1 },
  { id: 3, Icon: HiOutlineDocumentDuplicate, top: "70%", left: "10%", size: 50, delay: 2 },
  { id: 4, Icon: HiOutlineDocument, top: "80%", left: "80%", size: 45, delay: 0.5 },
  { id: 5, Icon: HiOutlineClipboardDocumentList, top: "40%", left: "50%", size: 55, delay: 1.5 },
];

function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="relative min-h-[calc(100vh-9rem)] overflow-hidden bg-gradient-to-br from-slate-50 to-brand-50/30 pt-1">
      {/* Floating Elements Background */}
      {floatingItems.map((item) => (
        <motion.div
          key={item.id}
          className="pointer-events-none absolute z-0 text-brand-600/10"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}

      <div className="page-shell relative z-10 space-y-7">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        >
        <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-brand-100/60 blur-2xl" />
        <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-mint-100/60 blur-xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              <HiOutlineSparkles className="h-3.5 w-3.5 text-brand-600" />
              Fast. Reliable. Professional Printing.
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-[3.05rem] sm:leading-[1.08]">
              Your digital photocopy shop for documents, stationery, and print jobs
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
              Sahana Photocopy helps students and offices place print requests, buy essential stationery,
              and track orders in one simple workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary gap-2">
                Browse Products
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/print-request" className="btn-secondary gap-2">
                Upload Print Job
                <HiOutlineDocumentDuplicate className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="panel-muted grid gap-3 p-5 sm:p-6">
            {[
              "Color/B&W printing with paper options",
              "Same-day photocopy and document binding",
              "Stationery products for school and office",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="stagger-fade grid gap-4 md:grid-cols-3">
        {[
          {
            icon: HiOutlineDocumentDuplicate,
            title: "Print Requests",
            desc: "Upload files, choose size, copies, and print mode.",
          },
          {
            icon: HiOutlineInboxStack,
            title: "Stationery Store",
            desc: "Books, pens, accessories, and office essentials.",
          },
          {
            icon: HiOutlineSparkles,
            title: "Live Order Tracking",
            desc: "Track processing and completion from your dashboard.",
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="rounded-2xl border border-white/50 bg-white/60 p-5 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-3 inline-flex rounded-xl bg-brand-100 p-2.5 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </motion.article>
          );
        })}
      </section>
      </div>
    </div>
  );
}

export default HomePage;
