import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:3001/expenses";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetch",
  async (userId) => {
    const res = await axios.get(`${API}?userId=${userId}`);
    return res.data;
  }
);

export const addExpense = createAsyncThunk(
  "expenses/add",
  async (data) => {
    const res = await axios.post(API, data);
    return res.data;
  }
);

export const editExpense = createAsyncThunk(
  "expenses/edit",
  async (data) => {
    const res = await axios.put(`${API}/${data.id}`, data);
    return res.data;
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (st, a) => {
        st.list = a.payload;
      })
      .addCase(addExpense.fulfilled, (st, a) => {
        st.list.push(a.payload);
      })
      .addCase(editExpense.fulfilled, (st, a) => {
        const i = st.list.findIndex((x) => x.id === a.payload.id);
        st.list[i] = a.payload;
      })
      .addCase(deleteExpense.fulfilled, (st, a) => {
        st.list = st.list.filter((x) => x.id !== a.payload);
      });
  },
});

export default expenseSlice.reducer;
