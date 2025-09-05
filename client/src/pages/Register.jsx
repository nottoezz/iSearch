import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("admin");
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("passw0rd!");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await register(name, email, password);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.error || "Registration failed");
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
              <h3 className="mb-3">Register</h3>
              {err && <div className="alert alert-danger py-2">{err}</div>}
              <form className="d-grid gap-3" onSubmit={submit}>
                <div>
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                  {loading ? "Creating…" : "Create account"}
                </button>
                <div className="text-muted small">
                  Have an account? <Link to="/login">Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
