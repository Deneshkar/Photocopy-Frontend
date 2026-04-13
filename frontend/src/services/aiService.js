// src/services/aiService.js
import axios from "axios";

/**
 * Call backend AI print assistant API
 */
export const getPrintSuggestions = async (message) => {
  const response = await axios.post("/api/ai/print-assist", { message });
  return response.data;
};