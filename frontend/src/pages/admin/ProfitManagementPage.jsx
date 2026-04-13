import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";

const INITIAL_FORM = {
  type: "income",
  title: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

const toCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

function ProfitManagementPage() {
  const [summary, setSummary] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM);

  const fetchProfitData = useCallback(async () => {
    try {
      setLoading(true);

      const summaryRes = await API.get("/profit/summary");

      setSummary(summaryRes.data || null);
      setEntries(summaryRes.data?.entries || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profit data");
      setSummary(null);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfitData();
  }, [fetchProfitData]);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      toast.error("Amount must be a valid non-negative number");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        amount,
        date: formData.date,
        note: formData.note.trim(),
      };

      if (editingId) {
        await API.put(`/profit/entries/${editingId}`, payload);
        toast.success("Entry updated successfully");
      } else {
        await API.post("/profit/entries", payload);
        toast.success("Entry added successfully");
      }

      await fetchProfitData();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setFormData({
      type: entry.type,
      title: entry.title || "",
      amount: String(entry.amount ?? ""),
      date: toDateInputValue(entry.date),
      note: entry.note || "",
    });
  };

  const handleDelete = async (entryId) => {
    const confirmed = globalThis.confirm("Delete this entry?");

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(`/profit/entries/${entryId}`);
      toast.success("Entry deleted successfully");
      await fetchProfitData();

      if (editingId === entryId) {
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete entry");
    }
  };

  const statCards = useMemo(
    () => [
      {
        label: "Order Income",
        value: toCurrency(summary?.orderIncome),
      },
      {
        label: "Manual Income",
        value: toCurrency(summary?.manualIncome),
      },
      {
        label: "Total Expenses",
        value: toCurrency(summary?.totalExpense),
      },
      {
        label: "Total Income",
        value: toCurrency(summary?.totalIncome),
      },
      {
        label: "Net Profit",
        value: toCurrency(summary?.netProfit),
      },
    ],
    [summary]
  );

  if (loading) {
    return <p>Loading profit management...</p>;
  }

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Profit Management</h1>
          <p className="page-subtitle">
            Track all income and expense entries and monitor live net profit.
          </p>
        </div>

        <button onClick={fetchProfitData} className="btn-secondary">
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <div key={card.label} className="panel p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="panel p-5">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {editingId ? "Edit Entry" : "Add Entry"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="label-ui" htmlFor="entry-type">Type</label>
            <select
              id="entry-type"
              name="type"
              className="input-ui"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label-ui" htmlFor="entry-title">Title</label>
            <input
              id="entry-title"
              name="title"
              type="text"
              className="input-ui"
              placeholder="Example: Machine maintenance"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="label-ui" htmlFor="entry-amount">Amount</label>
            <input
              id="entry-amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              className="input-ui"
              placeholder="0"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="label-ui" htmlFor="entry-date">Date</label>
            <input
              id="entry-date"
              name="date"
              type="date"
              className="input-ui"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="sm:col-span-2 xl:col-span-4">
            <label className="label-ui" htmlFor="entry-note">Note</label>
            <input
              id="entry-note"
              name="note"
              type="text"
              className="input-ui"
              placeholder="Optional note"
              value={formData.note}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-end gap-2">
            <button className="btn-primary w-full" type="submit" disabled={submitting}>
              {editingId ? "Update Entry" : "Add Entry"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary w-full"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No entries yet.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`status-badge ${
                        entry.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{entry.title}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {toCurrency(entry.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{entry.note || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn-secondary px-3 py-1.5"
                        onClick={() => handleEdit(entry)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger px-3 py-1.5"
                        onClick={() => handleDelete(entry._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfitManagementPage;
