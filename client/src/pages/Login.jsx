import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("passw0rd!");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-soft">
            <div className="card-body">
              <h3 className="mb-3">Login</h3>
              {err && <div className="alert alert-danger py-2">{err}</div>}
              <form className="d-grid gap-3" onSubmit={submit}>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Logging in…" : "Login"}
                </button>
                <div className="text-muted small">
                  No account? <Link to="/register">Register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
