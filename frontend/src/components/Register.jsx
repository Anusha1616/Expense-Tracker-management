import { useState } from "react";

function Register({ onRegister, onBackToLogin, loading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

await onRegister(
  name,
  email,
  password
);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>💰 Expense Tracker</h1>

        <h2>📝 Create Account</h2>

        <p>
          Create your account to manage your expenses
        </p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* EMAIL */}

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* CONFIRM PASSWORD */}

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          {/* REGISTER */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "📝 Create Account"}
          </button>

          {/* BACK TO LOGIN */}

          <button
            type="button"
            className="secondary-button"
            onClick={onBackToLogin}
          >
            🔙 Back to Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;