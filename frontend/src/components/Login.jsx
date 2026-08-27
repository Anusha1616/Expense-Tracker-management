import { useState } from "react";
import API from "../api/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Send login details to backend
      const response = await API.post("/auth/login", {
        email,
        password
      });

      console.log("Login response:", response.data);

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save login status
      localStorage.setItem(
        "loggedIn",
        "true"
      );

      // Save email
      localStorage.setItem(
        "userEmail",
        email
      );

      alert("Login successful!");

      // Tell App.jsx that login was successful
      onLogin();

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Invalid email or password."
        );
      } else {
        alert(
          "Cannot connect to server. Please make sure the backend is running."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>💰 Expense Tracker</h1>

        <h2>🔐 Login</h2>

        <p>Login to manage your expenses</p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "🔑 Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;