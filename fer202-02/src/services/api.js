import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const getCategories = async () => {
  const response = await api.get("/expenses");
  const categories = [...new Set(response.data.map(expense => expense.category))];
  return categories.sort();
};

export default api;
