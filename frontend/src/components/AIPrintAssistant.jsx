// src/components/AIPrintAssistant.jsx
import { useState } from "react";
import { getPrintSuggestions } from "../services/aiService";

export default function AIPrintAssistant({ onApplySuggestions }) {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!message.trim()) {
      setError("Please enter your print requirement.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuggestions(null);

      const data = await getPrintSuggestions(message);

      if (data.success) {
        setSuggestions(data.suggestions);
      } else {
        setError(data.message || "Failed to generate suggestions.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong while generating suggestions."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestions && onApplySuggestions) {
      onApplySuggestions(suggestions);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">AI Print Assistant</h2>
      <p className="text-sm text-gray-600 mb-4">
        Describe what you want to print, and the assistant will suggest the best settings.
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Example: I need to print my 40-page final report for university submission"
        className="w-full min-h-[120px] border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4 flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Suggestions"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMessage("");
            setSuggestions(null);
            setError("");
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 text-red-700 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {suggestions && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Suggested Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium text-gray-700">Paper Size:</span>{" "}
              <span className="text-gray-900">{suggestions.paperSize}</span>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium text-gray-700">Print Type:</span>{" "}
              <span className="text-gray-900">{suggestions.printType}</span>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium text-gray-700">Sides:</span>{" "}
              <span className="text-gray-900">{suggestions.sides}</span>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium text-gray-700">Copies:</span>{" "}
              <span className="text-gray-900">{suggestions.copies}</span>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium text-gray-700">Binding:</span>{" "}
              <span className="text-gray-900">{suggestions.binding}</span>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium text-gray-700">Lamination:</span>{" "}
              <span className="text-gray-900">{suggestions.lamination}</span>
            </div>

            <div className="bg-white border rounded-lg p-3">
              <span className="font-medium text-gray-700">Orientation:</span>{" "}
              <span className="text-gray-900">{suggestions.orientation}</span>
            </div>

            <div className="bg-white border rounded-lg p-3 md:col-span-2">
              <span className="font-medium text-gray-700">Notes:</span>{" "}
              <span className="text-gray-900">{suggestions.notes}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            Apply Suggestions
          </button>
        </div>
      )}
    </div>
  );
}