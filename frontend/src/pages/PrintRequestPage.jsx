import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineArrowUpTray,
  HiOutlineDocument,
  HiOutlineClipboardDocumentList,
  HiOutlinePrinter,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
]);

const floatingItems = [
  { id: 1, Icon: HiOutlinePrinter, top: "15%", left: "10%", size: 64, delay: 0 },
  { id: 2, Icon: HiOutlineDocumentDuplicate, top: "60%", left: "5%", size: 48, delay: 1.5 },
  { id: 3, Icon: HiOutlineClipboardDocumentList, top: "25%", left: "85%", size: 56, delay: 2 },
  { id: 4, Icon: HiOutlineDocument, top: "75%", left: "80%", size: 72, delay: 0.8 },
];

const maxFileSize = 10 * 1024 * 1024;

function PrintRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    phone: "",
    copies: 1,
    printType: "black_white",
    paperSize: "A4",
    sides: "single",
    note: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // AI assistant states
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name,
      }));
    }
  }, [user]);

  const validateSelectedFile = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      return false;
    }

    if (!allowedTypes.has(selectedFile.type)) {
      toast.error("Only PDF, DOC, DOCX, PNG, JPG, JPEG files are allowed");
      return false;
    }

    if (selectedFile.size > maxFileSize) {
      toast.error("File size must be less than 10MB");
      return false;
    }

    setFile(selectedFile);
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "copies") {
      setFormData((prev) => ({
        ...prev,
        [name]: Math.max(1, Number(value)),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!validateSelectedFile(selectedFile) && fileInputRef.current) {
      fileInputRef.current.value = "";
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!validateSelectedFile(droppedFile)) {
      return;
    }

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast.error("Customer name is required");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    if (Number(formData.copies) < 1) {
      toast.error("Copies must be at least 1");
      return false;
    }

    if (!file) {
      toast.error("Please select a file");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      customerName: user?.name || "",
      phone: "",
      copies: 1,
      printType: "black_white",
      paperSize: "A4",
      sides: "single",
      note: "",
    });

    setFile(null);
    setAiMessage("");
    setAiSuggestions(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate AI suggestions
  const handleGenerateAiSuggestions = async () => {
    if (!aiMessage.trim()) {
      toast.error("Please describe what you want to print");
      return;
    }

    try {
      setAiLoading(true);
      setAiSuggestions(null);

      const { data } = await API.post("/ai/print-assist", {
        message: aiMessage.trim(),
      });

      if (data?.success) {
        setAiSuggestions(data.suggestions);
        toast.success("AI suggestions generated successfully");
      } else {
        toast.error(data?.message || "Failed to generate suggestions");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate AI suggestions";

      toast.error(message);
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI suggestions to form
  const handleApplyAiSuggestions = () => {
    if (!aiSuggestions) {
      toast.error("No AI suggestions available");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      copies: aiSuggestions.copies || prev.copies,
      printType:
        aiSuggestions.printType === "Color"
          ? "color"
          : aiSuggestions.printType === "Black & White"
          ? "black_white"
          : prev.printType,
      paperSize:
        aiSuggestions.paperSize === "A4" || aiSuggestions.paperSize === "A3"
          ? aiSuggestions.paperSize
          : prev.paperSize,
      sides:
        aiSuggestions.sides === "Double-sided"
          ? "double"
          : aiSuggestions.sides === "Single-sided"
          ? "single"
          : prev.sides,
      note: aiSuggestions.notes || prev.note,
    }));

    toast.success("AI suggestions applied to the form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("customerName", formData.customerName.trim());
      submitData.append("phone", formData.phone.trim());
      submitData.append("copies", String(formData.copies));
      submitData.append("printType", formData.printType);
      submitData.append("paperSize", formData.paperSize);
      submitData.append("sides", formData.sides);
      submitData.append("note", formData.note.trim());
      submitData.append("file", file);

      await API.post("/print-requests", submitData);

      toast.success("Print request submitted successfully");
      resetForm();
      navigate("/my-print-requests");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit print request";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-9rem)] overflow-hidden bg-gradient-to-br from-slate-50 to-brand-50/30">
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

      <div className="page-shell relative z-10 space-y-7 backdrop-blur-sm pt-8">
        <div className="rounded-2xl border border-white/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="page-title text-3xl font-bold tracking-tight text-slate-900">
            Submit Print Request
          </h1>
          <p className="page-subtitle mt-2 text-slate-600">
            Upload your document and configure print settings.
          </p>

          {/* AI Assistant Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-brand-100 p-3 text-brand-700">
                <HiOutlineSparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">AI Print Assistant</h2>
                <p className="text-sm text-slate-600">
                  Describe your print need and get smart print suggestions.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="aiMessage" className="label-ui">
                  Describe your print request
                </label>
                <textarea
                  id="aiMessage"
                  className="block w-full rounded-xl border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Example: I need to print my 40-page final report for university submission"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  rows="4"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateAiSuggestions}
                  disabled={aiLoading}
                  className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-400"
                >
                  {aiLoading ? "Generating..." : "Generate Suggestions"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAiMessage("");
                    setAiSuggestions(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>

              {aiSuggestions && (
                <div className="rounded-2xl border border-brand-100 bg-white/80 p-5 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    Suggested Settings
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Paper Size
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {aiSuggestions.paperSize}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Print Type
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {aiSuggestions.printType}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Sides
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {aiSuggestions.sides}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Copies
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {aiSuggestions.copies}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Binding
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {aiSuggestions.binding}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Orientation
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {aiSuggestions.orientation}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Notes
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {aiSuggestions.notes}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyAiSuggestions}
                    className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  >
                    Apply Suggestions
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="customerName" className="label-ui">
                  Customer Name
                </label>
                <input
                  id="customerName"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  type="text"
                  name="customerName"
                  placeholder="Enter your name"
                  value={formData.customerName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="label-ui">
                  Phone Number
                </label>
                <input
                  id="phone"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="copies" className="label-ui">
                  Number of Copies
                </label>
                <input
                  id="copies"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  type="number"
                  name="copies"
                  min="1"
                  value={formData.copies}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="printType" className="label-ui">
                  Print Type
                </label>
                <select
                  id="printType"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  name="printType"
                  value={formData.printType}
                  onChange={handleChange}
                >
                  <option value="black_white">Black & White</option>
                  <option value="color">Color</option>
                </select>
              </div>

              <div>
                <label htmlFor="paperSize" className="label-ui">
                  Paper Size
                </label>
                <select
                  id="paperSize"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  name="paperSize"
                  value={formData.paperSize}
                  onChange={handleChange}
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>

              <div>
                <label htmlFor="sides" className="label-ui">
                  Print Sides
                </label>
                <select
                  id="sides"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  name="sides"
                  value={formData.sides}
                  onChange={handleChange}
                >
                  <option value="single">Single Side</option>
                  <option value="double">Double Side</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="note" className="label-ui">
                  Special Note
                </label>
                <textarea
                  id="note"
                  className="block w-full rounded-xl border-slate-200 bg-white/50 px-4 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                  name="note"
                  placeholder="Any special note..."
                  value={formData.note}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>

            <div>
              <label htmlFor="file" className="label-ui">
                Select File
              </label>
              <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleDrop}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                  isDragActive
                    ? "border-brand-400 bg-brand-50"
                    : "border-paper-300 bg-paper-100"
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="file"
                  className="hidden"
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />

                <div className="mx-auto mb-3 inline-flex rounded-xl bg-white p-3 text-brand-700 shadow-sm">
                  <HiOutlineArrowUpTray className="h-5 w-5" />
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  Drag & drop your file here
                </p>
                <p className="mt-1 text-xs text-slate-500">or click to browse</p>

                <button
                  type="button"
                  className="btn-secondary mt-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </button>

                <p className="mt-3 text-xs text-slate-500">
                  Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG | Max size: 10MB
                </p>

                {file && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-paper-200 bg-white/70 px-4 py-3 text-left shadow-sm">
                    <div className="flex min-w-0 items-center gap-2">
                      <HiOutlineDocumentText className="h-5 w-5 shrink-0 text-brand-600" />
                      <span className="truncate text-sm font-medium text-slate-700">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700"
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <HiOutlineXMark className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:bg-brand-700 hover:shadow-brand-600/40 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:bg-brand-400 sm:w-auto sm:px-8"
            >
              {loading ? "Submitting..." : "Submit Print Request"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default PrintRequestPage;