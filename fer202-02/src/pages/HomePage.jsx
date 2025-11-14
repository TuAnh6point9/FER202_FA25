import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import FilterBox from "../components/FilterBox";
import { fetchExpenses } from "../store/expenseSlice";

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const expenses = useSelector((s) => s.expenses.list);

  const [filter, setFilter] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    if (user) dispatch(fetchExpenses(user.id));
  }, []);

  const total = expenses
    .reduce((sum, e) => sum + Number(e.amount), 0)
    .toLocaleString("vi-VN") + " ₫";

  return (
    <div>
      <Header fullName={user.fullName} />

      <div className="container mt-4">
        <h3 className="mb-3">Total Expenses: {total}</h3>

        <FilterBox filter={filter} setFilter={setFilter} />

        <ExpenseForm userId={user.id} editingExpense={editingExpense} setEditingExpense={setEditingExpense} />

        <ExpenseTable expenses={expenses} filter={filter} setEditingExpense={setEditingExpense} />
      </div>

      <Footer />
    </div>
  );
}
