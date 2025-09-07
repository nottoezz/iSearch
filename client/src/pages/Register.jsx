import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Register() {
  const { register } = useAuth(); // get register action from auth context
  const nav = useNavigate(); // router navigation

  // controlled inputs + ui state
  const [name, setName] = useState("admin");
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
      await register(name, email, password);
      nav("/"); // go to dashboard
    } catch (e) {
      setErr(e.response?.data?.error || "Registration failed"); // show server error or fallback
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

              {/* error banner */}
              {err && <div className="alert alert-danger py-2">{err}</div>}

              {/* form */}
              <form className="d-grid gap-3" onSubmit={submit}>
                <div>
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // keep input controlled
                    required
                  />
                </div>

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
                  {loading ? "Creating…" : "Create account"}
                </button>

                {/* link to login */}
                <div className="small">
                  have an account? <Link to="/login">login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
