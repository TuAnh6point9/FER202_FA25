import { useDispatch } from "react-redux";
import { deleteExpense, editExpense } from "../store/expenseSlice";
import { useState } from "react";

export default function ExpenseTable({ expenses, filter }) {
  const dispatch = useDispatch();

  const filtered = expenses.filter((e) =>
    e.category.toLowerCase().includes(filter.toLowerCase())
  );

  const [editItem, setEditItem] = useState(null);

  const saveEdit = () => {
    dispatch(editExpense(editItem));
    setEditItem(null);
  };

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
              <td>
                {editItem?.id === e.id ? (
                  <input
                    className="form-control"
                    value={editItem.name}
                    onChange={(ev) =>
                      setEditItem({ ...editItem, name: ev.target.value })
                    }
                  />
                ) : (
                  e.name
                )}
              </td>

              <td>
                {editItem?.id === e.id ? (
                  <input
                    className="form-control"
                    type="number"
                    value={editItem.amount}
                    onChange={(ev) =>
                      setEditItem({ ...editItem, amount: ev.target.value })
                    }
                  />
                ) : (
                  Number(e.amount).toLocaleString("vi-VN") + " ₫"
                )}
              </td>

              <td>
                {editItem?.id === e.id ? (
                  <input
                    className="form-control"
                    value={editItem.category}
                    onChange={(ev) =>
                      setEditItem({ ...editItem, category: ev.target.value })
                    }
                  />
                ) : (
                  e.category
                )}
              </td>

              <td>{new Date(e.date).toLocaleDateString("vi-VN")}</td>

              <td>
                {editItem?.id === e.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm"
                            onClick={() => setEditItem(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => setEditItem(e)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => dispatch(deleteExpense(e.id))}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
