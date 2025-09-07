import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth(); // get auth state and logout
  const nav = useNavigate();
  const display = user?.name || (user?.email ? user.email.split("@")[0] : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        {/* brand */}
        <Link className="navbar-brand fw-bold" to="/">
          iSearch
        </Link>

        {/* mobile collapse toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse">
          {/* left nav (only when logged in) */}
          <ul className="navbar-nav me-auto">
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* right actions: auth buttons or welcome + logout */}
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {!user ? (
              <>
                {/* when logged out */}
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-primary btn-sm">
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {/* when logged in */}
                <li className="nav-item small">
                  welcome back{display ? `, ${display}` : ""}
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={async () => {
                      // logout then redirect to login
                      await logout();
                      nav("/login");
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
