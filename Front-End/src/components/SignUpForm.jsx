import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const user = { email, name, password, phone };

    try {
      const apibase = "http://localhost:3000/auth/register";
      const response = await fetch(apibase, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
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
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Signup success:", data);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error.message);
    }
  }

  return (
    <>
      <div className="signup-container">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label htmlFor="email" className="signup-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            required
          />

          <label htmlFor="name" className="signup-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="signup-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <label htmlFor="password" className="signup-label">
            Password:
          </label>
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
              {" "}
              <i
                id="toggle-password"
                className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>

          <label htmlFor="phone" className="signup-label">
            Phone:
          </label>
          <input
            type="tel"
            id="phone"
            className="signup-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+233123456789"
            pattern="\+233[0-9]{9}"
            required
          />

          <button type="submit" className="signup-submit-btn">
            Sign Up
          </button>
        </form>
        <p className="signup-login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
      <div className="booking-footer text-center text-sm text-gray-500 py-4">
        <p>© 2025 Shuttle System. All rights reserved.</p>
      </div>
    </>
  );
}

export default SignUpForm;
