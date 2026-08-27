import { useState, useEffect } from "react";

function Profile({ setPage }) {

  const [name, setName] = useState(() => {
    return localStorage.getItem("profileName") || "";
  });

  const [email, setEmail] = useState(() => {
    return localStorage.getItem("profileEmail") || "";
  });

  const [phone, setPhone] = useState(() => {
    return localStorage.getItem("profilePhone") || "";
  });

  const [editing, setEditing] = useState(false);

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = () => {

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    localStorage.setItem(
      "profileName",
      name
    );

    localStorage.setItem(
      "profileEmail",
      email
    );

    localStorage.setItem(
      "profilePhone",
      phone
    );

    setEditing(false);

    alert("Profile updated successfully!");
  };


  return (

    <div className="profile-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="profile-header">

        <button
          className="back-button"
          onClick={() => setPage("settings")}
        >
          ← Back
        </button>

        <h2>
          👤 My Profile
        </h2>

      </div>


      {/* =========================
          PROFILE CARD
      ========================= */}

      <div className="profile-card">

        <div className="profile-avatar">
          👤
        </div>

        {!editing ? (

          <>

            <h2>
              {name || "Your Name"}
            </h2>

            <p>
              📧 {email || "No email added"}
            </p>

            <p>
              📱 {phone || "No phone number added"}
            </p>


            <button
              className="edit-profile-btn"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>

          </>

        ) : (

          <div className="profile-form">

            {/* NAME */}

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />


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


            {/* PHONE */}

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />


            {/* BUTTONS */}

            <div className="profile-actions">

              <button
                className="save-profile-btn"
                onClick={saveProfile}
              >
                💾 Save
              </button>

              <button
                className="cancel-profile-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default Profile;