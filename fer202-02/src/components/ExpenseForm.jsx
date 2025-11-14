import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addExpense, editExpense } from "../store/expenseSlice";
import { getCategories } from "../services/api";

export default function ExpenseForm({ userId, editingExpense, setEditingExpense }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingExpense) {
      setName(editingExpense.name);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const submit = (e) => {
    e.preventDefault();

    if (!name || !category || amount <= 0) {
      return setErr("Invalid input!");
    }

    if (editingExpense) {
      // Edit mode
      dispatch(
        editExpense({ ...editingExpense, name, amount, category, date })
      );
      setEditingExpense(null);
    } else {
      // Add mode
      dispatch(
        addExpense({ userId, name, amount, category, date })
      );
    }

    setName("");
    setAmount("");
    setCategory("");
    setDate("");
    setErr("");
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    setName("");
    setAmount("");
    setCategory("");
    setDate("");
    setErr("");
  };

  return (
    <div className="card p-3 mb-3">
      <h5>{editingExpense ? "Edit Expense" : "Add Expense"}</h5>
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Name"
               value={name} onChange={(e) => setName(e.target.value)} />

        <input className="form-control mb-2" placeholder="Amount" type="number"
               value={amount} onChange={(e) => setAmount(e.target.value)} />

        <select className="form-control mb-2"
                value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input className="form-control mb-2" type="date"
               value={date} onChange={(e) => setDate(e.target.value)} />

        <div className="d-flex gap-2">
          <button className="btn btn-success flex-grow-1">
            {editingExpense ? "Save" : "Add"}
          </button>
          {editingExpense && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
