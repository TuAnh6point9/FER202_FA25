export default function Header({ fullName }) {
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">PersonalBudget</span>
      <div className="text-white">
        Signed in as <strong>{fullName}</strong>
        <button className="btn btn-warning btn-sm ms-3" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
