import { useDispatch } from "react-redux";
import { deleteExpense } from "../store/expenseSlice";

export default function ExpenseTable({ expenses, filter, setEditingExpense }) {
  const dispatch = useDispatch();

  const filtered = expenses.filter((e) =>
    e.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="card p-3">
      <h5>Expense Management</h5>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th width="160">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{Number(e.amount).toLocaleString("vi-VN")} ₫</td>
              <td>{e.category}</td>
              <td>{new Date(e.date).toLocaleDateString("vi-VN")}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditingExpense(e)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => dispatch(deleteExpense(e.id))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
