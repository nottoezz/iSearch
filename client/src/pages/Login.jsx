import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Login() {
  const { login } = useAuth(); // get login action from auth context
  const nav = useNavigate(); // router navigation

  // simple controlled inputs + ui state
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("passw0rd!");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // handle submit: call api, route to dashboard on success
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed"); // show server error or fallback
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

              {/* error banner */}
              {err && <div className="alert alert-danger py-2">{err}</div>}

              {/* form */}
              <form className="d-grid gap-3" onSubmit={submit}>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // keep input controlled
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // keep input controlled
                    required
                  />
                </div>

                {/* submit */}
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Logging in…" : "Login"}
                </button>

                {/* link to register */}
                <div className="small">
                  no account? <Link to="/register">register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
