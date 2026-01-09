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
      .get("/public/association-info") // ✅ ONLY CORRECT ENDPOINT
      .then((res) => {
        setAssociation(res.data.data.association);
      })
      .catch((err) => {
        console.error("PUBLIC ASSOCIATION ERROR 👉", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 60 }}>Loading...</div>;

  if (!association)
    return <div style={{ padding: 60 }}>No association info found</div>;

  return (
    <>
      <PublicNavbar />

      <div style={page}>
        {association.logo && (
          <img
            src={import.meta.env.VITE_API_BASE_URL + association.logo}
            alt="logo"
            style={logo}
          />
        )}

        <h1>{association.name}</h1>

        <p><b>Registration No:</b> {association.registration_no}</p>
        <p><b>Established:</b> {association.established_year}</p>
        <p><b>Address:</b> {association.address}</p>
        <p><b>Phone:</b> {association.phone}</p>
        <p><b>Email:</b> {association.email}</p>

        <button style={btn} onClick={() => navigate("/donate")}>
          🙏 Donate Now
        </button>
      </div>

      <Footer />
    </>
  );
}

/* ================= STYLES ================= */

const page = {
  maxWidth: 700,
  margin: "60px auto",
  padding: 30,
  textAlign: "center",
};

const logo = {
  width: 140,
  marginBottom: 20,
};

const btn = {
  marginTop: 30,
  padding: "14px 30px",
  fontSize: 16,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};
