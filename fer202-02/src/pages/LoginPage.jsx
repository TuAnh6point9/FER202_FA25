import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error
    setErr("");
    setPassErr("");

    // Case 1: Both empty
    if (!u || !p) {
      setErr("Username and password are required");
      return;
    }

    // Case 2: Password < 6 chars
    if (p.length < 6) {
      setPassErr("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3001/users?username=${u}&password=${p}`
      );

      if (res.data.length === 0) {
        setErr("Invalid username or password");
        return;
      }

      const user = res.data[0];
      localStorage.setItem("user", JSON.stringify(user));
      nav("/home");
    } catch (error) {
      setErr("Server error");
    }
  };

  const cancelLogin = () => {
    setU("");
    setP("");
    setErr("");
    setPassErr("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ width: 380 }}>
        <h3 className="text-center mb-4">Login</h3>

        {/* Error Alert */}
        {err && (
          <div className="alert alert-danger text-center">
            {err}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* USERNAME */}
          <label className="form-label">Username</label>
          <input
            className="form-control mb-3"
            placeholder="Enter username"
            value={u}
            onChange={(e) => setU(e.target.value)}
          />

          {/* PASSWORD */}
          <label className="form-label">Password</label>
          <input
            className={`form-control ${passErr ? "is-invalid" : ""}`}
            type="password"
            placeholder="Enter password"
            value={p}
            onChange={(e) => setP(e.target.value)}
          />

          {/* Password error (red text + red icon) */}
          {passErr && (
            <div className="invalid-feedback d-block">
              {passErr}
            </div>
          )}

          <div className="text-muted mt-1 mb-3" style={{ fontSize: 13 }}>
            (at least 6 characters)
          </div>

          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-3">
            <button type="submit" className="btn btn-primary w-50 me-2">
              Login
            </button>
            <button type="button" className="btn btn-secondary w-50" onClick={cancelLogin}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}