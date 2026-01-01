import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Profile() {
  /* =========================
     🧾 PROFILE STATE
  ========================= */
  const [profile, setProfile] = useState({
    name: "",
    personal_email: "",
    phone: "",
    profile_image: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null);

  /* =========================
     🖼️ DP STATE
  ========================= */
  const [dp, setDp] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  /* =========================
     ⚙️ UI STATE
  ========================= */
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dpLoading, setDpLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [msg, setMsg] = useState("");

  /* =========================
     📥 LOAD PROFILE
  ========================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/members/profile");

        const data = {
          name: res.data?.name || "",
          personal_email: res.data?.personal_email || "",
          phone: res.data?.phone || "",
          profile_image: res.data?.profile_image || "",
        };

        setProfile(data);
        setOriginalProfile(data);
      } catch {
        alert("Failed to load profile");
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* =========================
     🧹 CLEAN PREVIEW URL
  ========================= */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* =========================
     💾 SAVE PROFILE
  ========================= */
  const saveProfile = async () => {
    try {
      setLoading(true);
      setMsg("");

      await api.put("/members/profile", {
        name: profile.name,
        personal_email: profile.personal_email,
        phone: profile.phone,
      });

      setMsg("✅ Profile updated successfully");
      setOriginalProfile(profile);
      setEditMode(false);
    } catch {
      setMsg("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ❌ CANCEL EDIT
  ========================= */
  const cancelEdit = () => {
    setProfile(originalProfile);
    setEditMode(false);
  };

  /* =========================
     🖼️ UPLOAD PROFILE DP
  ========================= */
  const uploadDP = async () => {
    if (!dp) return;

    const fd = new FormData();
    fd.append("dp", dp); // MUST MATCH BACKEND

    try {
      setDpLoading(true);
      const res = await api.post("/members/profile-dp", fd);

      setProfile((prev) => ({
        ...prev,
        profile_image: res.data.image,
      }));

      fileInputRef.current.value = "";
      setDp(null);
      setPreview("");

      alert("Profile picture updated");
    } catch (err) {
      console.error(err);
      alert("DP upload failed");
    } finally {
      setDpLoading(false);
    }
  };

  if (pageLoading) {
    return <p style={{ padding: 30 }}>Loading profile...</p>;
  }

  return (
    <>
      <Navbar />

      <div style={container}>
        <h2 style={{ marginBottom: 20 }}>My Profile</h2>

        {/* =========================
            🖼️ PROFILE IMAGE
        ========================= */}
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <img
            src={
              preview ||
              (profile.profile_image
                ? `http://localhost:3000${profile.profile_image}`
                : "/default-avatar.png")
            }
            alt="Profile"
            style={avatar}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (!e.target.files[0]) return;
              setDp(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            style={{ marginTop: 10 }}
          />

          <button
            onClick={uploadDP}
            disabled={!dp || dpLoading}
            style={{
              ...dpBtn,
              opacity: dp ? 1 : 0.6,
              cursor: dp ? "pointer" : "not-allowed",
            }}
          >
            {dpLoading ? "Uploading..." : "Update Profile Photo"}
          </button>
        </div>

        {msg && <p style={message}>{msg}</p>}

        {/* =========================
            ✏️ PROFILE FIELDS
        ========================= */}
        <input
          style={input}
          value={profile.name}
          disabled={!editMode}
          placeholder="Full Name"
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <input
          style={input}
          value={profile.personal_email}
          disabled={!editMode}
          placeholder="Personal Email"
          onChange={(e) =>
            setProfile({
              ...profile,
              personal_email: e.target.value,
            })
          }
        />

        <input
          style={input}
          value={profile.phone}
          disabled={!editMode}
          placeholder="Phone Number"
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        {/* =========================
            🔘 ACTION BUTTONS
        ========================= */}
        {!editMode ? (
          <button style={editBtn} onClick={() => setEditMode(true)}>
            ✏️ Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={saveBtn}
              onClick={saveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "💾 Save"}
            </button>
            <button style={cancelBtn} onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================
   🎨 STYLES
========================= */

const container = {
  maxWidth: 450,
  margin: "40px auto",
  padding: 30,
};

const avatar = {
  width: 120,
  height: 120,
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #ccc",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const editBtn = {
  width: "100%",
  padding: 12,
  background: "#1976d2",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const saveBtn = {
  flex: 1,
  padding: 12,
  background: "green",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const cancelBtn = {
  flex: 1,
  padding: 12,
  background: "gray",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const dpBtn = {
  marginTop: 10,
  padding: "8px 14px",
  background: "#2f86eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};

const message = {
  color: "green",
  marginBottom: 12,
};
