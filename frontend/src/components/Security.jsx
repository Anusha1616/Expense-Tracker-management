import { useState } from "react";
import API from "../api/api";

function Security({ setPage }) {

  const [showPassword, setShowPassword] = useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // =========================
  // CHANGE PASSWORD
  // =========================

  // =========================
// CHANGE PASSWORD
// =========================

const changePassword = async () => {

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    alert("Please fill all password fields.");
    return;
  }

  if (newPassword.length < 6) {
    alert(
      "New password must contain at least 6 characters."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
    return;
  }

  try {

    const response = await API.put(
      "/auth/change-password",
      {
        currentPassword,
        newPassword
      }
    );

    alert(
      response.data.message ||
      "Password changed successfully!"
    );

    // Clear password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (error) {

    console.error(
      "Change password error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to change password"
    );
  }
};
  return (

    <div className="security-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="security-header">

        <button
          className="back-button"
          onClick={() => setPage("settings")}
        >
          ← Back
        </button>

        <h2>
          🔐 Security
        </h2>

      </div>


      {/* =========================
          PASSWORD CARD
      ========================= */}

      <div className="settings-card">

        <h3>
          🔑 Change Password
        </h3>

        <p>
          Update your account password.
        </p>


        {/* CURRENT PASSWORD */}

        <label>
          Current Password
        </label>

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }
        />


        {/* NEW PASSWORD */}

        <label>
          New Password
        </label>

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
        />


        {/* CONFIRM PASSWORD */}

        <label>
          Confirm New Password
        </label>

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
        />


        {/* SHOW PASSWORD */}

        <label className="show-password">

          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) =>
              setShowPassword(
                e.target.checked
              )
            }
          />

          Show Password

        </label>


        {/* CHANGE BUTTON */}

        <button
          className="save-profile-btn"
          onClick={changePassword}
        >
          🔐 Change Password
        </button>

      </div>


      {/* =========================
          SECURITY INFORMATION
      ========================= */}

      <div className="settings-card">

        <h3>
          🛡️ Security Information
        </h3>

        <p>
          🔒 Keep your password private.
        </p>

        <p>
          🔑 Use a strong password with
          letters, numbers and symbols.
        </p>

        <p>
          🚪 Always logout when using a
          shared device.
        </p>

      </div>

    </div>

  );
}

export default Security;