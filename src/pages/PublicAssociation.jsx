import { useEffect, useState } from "react";
import api from "../api/api";
import Footer from "../components/Footer";
import PublicNavbar from "../components/PublicNavbar";
import { useNavigate } from "react-router-dom";

export default function PublicAssociation() {
  const [association, setAssociation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/public/association-info") // ✅ SAME ENDPOINT
      .then((res) => {
        setAssociation(res.data.data.association);
      })
      .catch((err) => {
        console.error("PUBLIC ASSOCIATION ERROR 👉", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={loadingBox}>Loading...</div>;

  if (!association)
    return <div style={loadingBox}>No association info found</div>;

  return (
    <>
      <PublicNavbar />

      <div style={page}>
        <div style={card}>
          {association.logo && (
            <img
              src={import.meta.env.VITE_API_BASE_URL + association.logo}
              alt="logo"
              style={logo}
            />
          )}

          <h1 style={title}>{association.name}</h1>

          <p style={sub}>
            Registered Non-Profit Organization
          </p>

          <div style={infoGrid}>
            <Info label="Registration No" value={association.registration_no} />
            <Info label="Established" value={association.established_year} />
            <Info label="Address" value={association.address} />
            <Info label="Phone" value={association.phone} />
            <Info label="Email" value={association.email} />
          </div>

          <button style={btnPrimary} onClick={() => navigate("/donate")}>
            🙏 Donate Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ================= SMALL INFO ITEM ================= */
function Info({ label, value }) {
  return (
    <div style={infoItem}>
      <small style={infoLabel}>{label}</small>
      <div style={infoValue}>{value}</div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "80vh",
  background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "60px 16px",
};

const card = {
  maxWidth: 760,
  width: "100%",
  background: "rgba(255,255,255,.9)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  padding: "40px 30px",
  boxShadow: "0 30px 60px rgba(0,0,0,.12)",
  textAlign: "center",
};

const logo = {
  width: 140,
  marginBottom: 20,
};

const title = {
  fontSize: 34,
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: 6,
};

const sub = {
  color: "#475569",
  marginBottom: 30,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
  marginBottom: 30,
};

const infoItem = {
  background: "#f8fafc",
  padding: 16,
  borderRadius: 14,
  textAlign: "left",
};

const infoLabel = {
  fontSize: 12,
  color: "#64748b",
};

const infoValue = {
  fontWeight: 600,
  color: "#0f172a",
  marginTop: 4,
};

const btnPrimary = {
  background: "linear-gradient(135deg,#2563eb,#1e40af)",
  color: "#fff",
  padding: "14px 36px",
  fontSize: 16,
  border: "none",
  borderRadius: 999,
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(37,99,235,.45)",
};

const loadingBox = {
  padding: 60,
  textAlign: "center",
  fontSize: 18,
};
