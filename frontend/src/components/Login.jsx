import { useState } from "react";
import API from "../api/api";

function Login({ onLogin }) {
  // =========================
  // LOGIN STATES
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // COMMON STATES
  // =========================

  const [loading, setLoading] = useState(false);

  // =========================
  // FORGOT PASSWORD STATES
  // =========================

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetStep, setResetStep] = useState("email");

  // =========================
  // NORMAL LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful!");

      // Send user information to App.jsx
      if (onLogin) {
        onLogin(response.data.user);
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Login failed."
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

  // =========================
  // SEND OTP
  // =========================

  const handleSendOTP = async () => {
    if (!forgotEmail) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/forgot-password",
        {
          email: forgotEmail,
        }
      );

      console.log("OTP response:", response.data);

      // Move to OTP screen
      setResetStep("otp");

      alert(
        response.data.message ||
        "OTP sent successfully!"
      );

    } catch (error) {
      console.error("OTP error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Unable to send OTP."
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

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      alert("OTP must contain 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/verify-otp",
        {
          email: forgotEmail,
          otp: otp,
        }
      );

      console.log(
        "OTP verification response:",
        response.data
      );

      // Move to password reset screen
      setResetStep("password");

      alert(
        response.data.message ||
        "OTP verified successfully!"
      );

    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
          "Invalid OTP."
        );
      } else {
        alert(
          "Cannot connect to server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert(
        "Please enter both password fields."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/reset-password",
        {
          email: forgotEmail,
          otp: otp,
          newPassword: newPassword,
        }
      );

      console.log(
        "Password reset response:",
        response.data
      );

      alert(
        response.data.message ||
        "Password reset successfully!"
      );

      // Go back to login
      setShowForgotPassword(false);

      setResetStep("email");

      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
          "Unable to reset password."
        );
      } else {
        alert(
          "Cannot connect to server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD PAGE
  // =========================

  if (showForgotPassword) {
    return (
      <div className="login-page">

        <div className="login-card">

          <h1>
            💰 Expense Tracker
          </h1>

          <h2>
            🔑 Forgot Password
          </h2>

          {/* =========================
              EMAIL STEP
          ========================= */}

          {resetStep === "email" && (
            <>
              <p>
                Enter your registered email
                to receive an OTP.
              </p>

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) =>
                  setForgotEmail(e.target.value)
                }
              />

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "📩 Send OTP"}
              </button>
            </>
          )}

          {/* =========================
              OTP STEP
          ========================= */}

          {resetStep === "otp" && (
            <>
              <p>
                OTP sent to:
              </p>

              <strong>
                {forgotEmail}
              </strong>

              <label>
                Enter OTP
              </label>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                maxLength="6"
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "✅ Verify OTP"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setResetStep("email");
                  setOtp("");
                }}
              >
                🔙 Change Email
              </button>
            </>
          )}

          {/* =========================
              PASSWORD STEP
          ========================= */}

          {resetStep === "password" && (
            <>
              <p>
                Create your new password.
              </p>

              <label>
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "🔐 Reset Password"}
              </button>
            </>
          )}

          {/* =========================
              BACK TO LOGIN
          ========================= */}

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setShowForgotPassword(false);
              setResetStep("email");
              setForgotEmail("");
              setOtp("");
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            🔙 Back to Login
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // NORMAL LOGIN PAGE
  // =========================

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          💰 Expense Tracker
        </h1>

        <h2>
          🔐 Login
        </h2>

        <p>
          Login to manage your expenses
        </p>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* PASSWORD */}

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {/* FORGOT PASSWORD */}

          <div className="forgot-password">

            <button
              type="button"
              onClick={() =>
                setShowForgotPassword(true)
              }
            >
              Forgot Password?
            </button>

          </div>

          {/* LOGIN BUTTON */}

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