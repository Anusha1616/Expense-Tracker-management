import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/api";
import Register from "./Register";
import VerifyRegistration from "./VerifyRegistration";

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

  const [resendCooldown, setResendCooldown] = useState(0);

  // =========================
  // FORGOT PASSWORD STATES
  // =========================

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [showRegistrationOTP,
  setShowRegistrationOTP] =
  useState(false);

const [registrationEmail,
  setRegistrationEmail] =
  useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetStep, setResetStep] = useState("email");


  // =========================
// OTP COUNTDOWN TIMER
// =========================

useEffect(() => {
  if (resetStep !== "otp" || otpTimeLeft <= 0) {
    return;
  }

  const timer = setInterval(() => {
    setOtpTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [resetStep, otpTimeLeft]);



  // handle register login//

  const handleRegister = async (name, email, password) => {
  try {
    setLoading(true);

    const response = await API.post("/auth/register", {
      name,
      email,
      password
    });
alert(response.data.message);

setRegistrationEmail(email);

setShowRegister(false);

setShowRegistrationOTP(true);

  } catch (error) {
    console.error("Register error:", error);

    if (error.response) {
      alert(
        error.response.data.message ||
        "Registration failed."
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

    const response = await axios.post(
      "https://expense-tracker-management-sw2z.vercel.app/api/auth/forgot-password",
      {
        email: forgotEmail
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    alert(
      response.data.message ||
      "OTP sent successfully!"
    );

    setResetStep("otp");
    setOtp("");
    setOtpTimeLeft(60); // 1 minute countdown

  } catch (error) {
    console.error("Send OTP Error:", error);

    if (error.response) {
      alert(
        error.response.data.message ||
        "Unable to send OTP."
      );
    } else {
      console.error("Network error:", error.message);

      alert(
        "Cannot connect to server. Please try again."
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
// RESEND PASSWORD RESET OTP
// =========================

const handleResendOTP = async () => {
  if (resendCooldown > 0) {
    return;
  }

  try {
    setLoading(true);

    const response = await API.post(
      "/auth/resend-password-otp",
      {
        email: forgotEmail
      }
    );

    // Clear old OTP
    setOtp("");

    alert(
      response.data.message ||
      "New OTP sent successfully!"
    );

    // Start 60 second cooldown
    setResendCooldown(60);

    const countdown = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

  } catch (error) {
    console.error(
      "Resend OTP error:",
      error
    );

    if (error.response) {
      alert(
        error.response.data.message ||
        "Unable to resend OTP."
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

// show registration OTP page//
if (showRegistrationOTP) {
  return (
    <VerifyRegistration
      email={registrationEmail}
      loading={loading}
      setLoading={setLoading}
      onVerified={() => {
        alert(
          "Account created successfully!"
        );

        setShowRegistrationOTP(false);
      }}
      onBackToRegister={() => {
        setShowRegistrationOTP(false);
        setShowRegister(true);
      }}
    />
  );
}

  // =========================
// REGISTER PAGE
// =========================

if (showRegister) {
  return (
    <Register
      onRegister={handleRegister}
      onBackToLogin={() => setShowRegister(false)}
      loading={loading}
    />
  );
}
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
  autoComplete="off"
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

              <p style={{ textAlign: "center", margin: "10px 0" }}>
  {otpTimeLeft > 0 ? (
    <>⏳ OTP expires in <strong>
      {Math.floor(otpTimeLeft / 60)}:
      {String(otpTimeLeft % 60).padStart(2, "0")}
    </strong></>
  ) : (
    <strong>⚠️ OTP has expired</strong>
  )}
</p>

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
  onClick={handleResendOTP}
  disabled={loading || resendCooldown > 0}
>
  {resendCooldown > 0
    ? `📩 Resend OTP (${resendCooldown}s)`
    : "📩 Resend OTP"}
</button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setResetStep("email");
                  setOtp("");
                  setResendCooldown(0);
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
  autoComplete="new-password"
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

          <p>
  Don't have an account?{" "}
  <button type="button" onClick={() => setShowRegister(true)}>
    Create Account
  </button>
</p>

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