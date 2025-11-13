import { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpense } from "../store/expenseSlice";

export default function ExpenseForm({ userId }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [err, setErr] = useState("");

  const dispatch = useDispatch();

  const submit = (e) => {
    e.preventDefault();

    if (!name || !category || amount <= 0) {
      return setErr("Invalid input!");
    }

    dispatch(
      addExpense({ userId, name, amount, category, date })
    );

    setName("");
    setAmount("");
    setCategory("");
    setDate("");
    setErr("");
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Add Expense</h5>
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Name"
               value={name} onChange={(e) => setName(e.target.value)} />

        <input className="form-control mb-2" placeholder="Amount" type="number"
               value={amount} onChange={(e) => setAmount(e.target.value)} />

        <input className="form-control mb-2" placeholder="Category"
               value={category} onChange={(e) => setCategory(e.target.value)} />

        <input className="form-control mb-2" type="date"
               value={date} onChange={(e) => setDate(e.target.value)} />

        <button className="btn btn-success w-100">Add</button>
      </form>
    </div>
  );
}
