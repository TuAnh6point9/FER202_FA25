import { useDispatch } from "react-redux";
import { deleteExpense } from "../store/expenseSlice";
import { useState } from "react";

export default function ExpenseTable({ expenses, filter, setEditingExpense }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const filtered = expenses.filter((e) =>
    e.category.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDeleteClick = (expense) => {
    setDeleteId(expense.id);
    setDeleteName(expense.name);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteExpense(deleteId));
    setShowModal(false);
    setDeleteId(null);
    setDeleteName("");
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteId(null);
    setDeleteName("");
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
                  onClick={() => handleDeleteClick(e)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete expense <strong>"{deleteName}"</strong>?</p>
                  <p className="text-muted mb-0">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
