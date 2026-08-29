import { useState, useEffect } from "react";
import API from "../api/api";

function Profile({ setPage }) {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");

const [loading, setLoading] = useState(true);
const [editing, setEditing] = useState(false);

useEffect(() => {

  const fetchProfile = async () => {

    try {

      const response =
        await API.get("/auth/profile");

      const user = response.data.user;

      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");

    } catch (error) {

      console.error(
        "Failed to fetch profile:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to load profile"
      );

    } finally {

      setLoading(false);

    }
  };

  fetchProfile();

}, []);

  // =========================
  // SAVE PROFILE
  // =========================

 const saveProfile = async () => {

  if (!name.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!email.trim()) {
    alert("Please enter your email.");
    return;
  }

  try {

    const response = await API.put(
      "/auth/profile",
      {
        name: name,
        email: email,
        phone: phone
      }
    );

    const user = response.data.user;

    // Update displayed values with backend response
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");

    setEditing(false);

    alert("Profile updated successfully!");

  } catch (error) {

    console.error(
      "Update profile error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to update profile"
    );

  }
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