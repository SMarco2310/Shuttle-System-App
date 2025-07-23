import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      const apibase = "http://localhost:3000/auth/login";
      const response = await fetch(apibase, {
        method: "POST",
        credentials: "include", // Important: send cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        mode: "cors",
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!response.ok) {
        setLoginError(true);
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  }

  return (
    <>
      <div className="auth-form-container">
        <h2>Login</h2>
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <label htmlFor="password">Password:</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <i
                id="toggle-password"
                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        {loginError && (
          <p className="error-message" style={{ color: "red" }}>
            Invalid email or password
          </p>
        )}
        <p className="form-footer">
          Don&apos;t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>

      <div className="booking-footer text-center text-sm text-gray-500 py-4">
        <p>© 2025 Shuttle System. All rights reserved.</p>
      </div>
    </>
  );
}

export default LoginForm;
