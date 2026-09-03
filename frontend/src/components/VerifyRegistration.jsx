import { useEffect, useState } from "react";
import API from "../api/api";

function VerifyRegistration({
  email,
  onVerified,
  onBackToRegister,
  loading,
  setLoading
}) {
  const [otp, setOtp] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(60);

  useEffect(() => {
  if (otpTimeLeft <= 0) {
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
}, [otpTimeLeft]);
  const [resendCooldown, setResendCooldown] = useState(0);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      alert("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/verify-registration-otp",
        {
          email,
          otp
        }
      );

      alert(response.data.message);

      // Account successfully created
      onVerified();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
  if (resendCooldown > 0) {
    return;
  }

  try {
    setLoading(true);

    const response = await API.post(
      "/auth/resend-registration-otp",
      {
        email
      }
    );

    alert(response.data.message);

    // Start 60 second cooldown
    setResendCooldown(60);
    setOtp("");
    setOtpTimeLeft(60);

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
    alert(
      error.response?.data?.message ||
      "Unable to resend OTP."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>💰 Expense Tracker</h1>

        <h2>📧 Verify Your Email</h2>

        <p>
          We have sent a 6-digit OTP to:
        </p>

        <strong>{email}</strong>

        <p>
          Enter the OTP below to complete your registration.
        </p>

        <form onSubmit={handleSubmit}>

          <label>OTP</label>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setOtp(value);
            }}
          />
          <p style={{ textAlign: "center", margin: "10px 0" }}>
  {otpTimeLeft > 0 ? (
    <>
      ⏳ OTP expires in{" "}
      <strong>
        {Math.floor(otpTimeLeft / 60)}:
        {String(otpTimeLeft % 60).padStart(2, "0")}
      </strong>
    </>
  ) : (
    <strong>⚠️ OTP has expired</strong>
  )}
</p>

          <button
            type="submit"
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
            onClick={onBackToRegister}
            disabled={loading}
          >
            🔙 Back to Register
          </button>

        </form>

      </div>
    </div>
  );
}

export default VerifyRegistration;