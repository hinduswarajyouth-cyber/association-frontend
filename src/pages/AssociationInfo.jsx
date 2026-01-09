import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AssociationInfo() {
  const [data, setData] = useState({});
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/association").then((res) => {
      setData(res.data.data || {});
      setLoading(false);
    });
  }, []);

  /* =========================
     SAVE (WITH LOGO)
  ========================= */
  const save = async () => {
    const formData = new FormData();

    Object.keys(data).forEach((k) => {
      if (data[k] !== null && data[k] !== undefined) {
        formData.append(k, data[k]);
      }
    });

    if (logo) formData.append("logo", logo);

    await api.post("/association", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setMsg("Saved successfully");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div style={page}>
        <h2>🏛 Association Information</h2>

        {msg && <p style={{ color: "green" }}>{msg}</p>}

        {/* TEXT FIELDS */}
        {fields.map((f) => (
          <input
            key={f.key}
            placeholder={f.label}
            value={data[f.key] || ""}
            onChange={(e) =>
              setData({ ...data, [f.key]: e.target.value })
            }
            style={input}
          />
        ))}

        {/* LOGO UPLOAD */}
        <label style={{ marginTop: 10, fontWeight: 600 }}>
          Association Logo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          style={{ marginBottom: 10 }}
        />

        {/* EXISTING LOGO (FROM DB) */}
        {data.logo && !logo && (
          <img
            src={import.meta.env.VITE_API_BASE_URL + data.logo}
            alt="logo"
            style={{ width: 120, marginTop: 10 }}
          />
        )}

        {/* NEW LOGO PREVIEW */}
        {logo && (
          <img
            src={URL.createObjectURL(logo)}
            alt="preview"
            style={{ width: 120, marginTop: 10 }}
          />
        )}

        <br />

        <button style={btn} onClick={save}>
          Save
        </button>
      </div>
    </>
  );
}

/* =========================
   FIELDS
========================= */
const fields = [
  { key: "name", label: "Association Name" },
  { key: "registration_no", label: "Registration No" },
  { key: "established_year", label: "Established Year" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "bank_name", label: "Bank Name" },
  { key: "account_no", label: "Account No" },
  { key: "ifsc", label: "IFSC Code" },
];

/* =========================
   STYLES
========================= */
const page = { padding: 30 };

const input = {
  display: "block",
  width: 400,
  padding: 10,
  marginBottom: 10,
};

const btn = {
  padding: "10px 20px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
