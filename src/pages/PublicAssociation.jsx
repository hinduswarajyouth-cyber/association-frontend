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
      .get("/public/association-info")
      .then(res => {
        setAssociation(res.data?.data?.association || null);
      })
      .catch(err => {
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
        {/* ================= HERO ================= */}
        <section style={hero}>
          <img
            src={association.logo_url || "/logo.png"}
            alt={association.name}
            style={logo}
          />

          <h1 style={title}>{association.name}</h1>

          <p style={subtitle}>
            Registered Non-Profit Organization • Empowering Youth • Serving Society
          </p>

          <div style={ctaRow}>
            <a href="/donate" style={btnPrimary}>
              🙏 Donate Now
            </a>
            <a href="/login" style={btnGhost}>
              Member Login
            </a>
          </div>
        </section>

        {/* ================= HIGHLIGHTS ================= */}
        <section style={highlightGrid}>
          <div style={highlightCard}>
            <h3>🏛 Registration</h3>
            <p><b>{association.registration_no}</b></p>
            <small>Government Registered Trust</small>
          </div>

          <div style={highlightCard}>
            <h3>📅 Established</h3>
            <p><b>{association.established_year}</b></p>
            <small>Growing Youth Organization</small>
          </div>

          <div style={highlightCard}>
            <h3>📍 Location</h3>
            <p><b>{association.city}</b></p>
            <small>{association.state}, {association.country}</small>
          </div>

          <div style={highlightCard}>
            <h3>📞 Contact</h3>
            <p>{association.phone}</p>
            <small>{association.email}</small>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section style={aboutSection}>
          <h2>🌱 About Our Association</h2>
          <p>{association.about}</p>
        </section>

        {/* ================= MISSION / VISION ================= */}
        <section style={mvGrid}>
          <div style={mvCard}>
            <h3>🎯 Our Mission</h3>
            <p>{association.mission}</p>
          </div>

          <div style={mvCard}>
            <h3>🌍 Our Vision</h3>
            <p>{association.vision}</p>
          </div>
        </section>

        {/* ================= ACTIVITIES ================= */}
        <section style={activitySection}>
          <h2>🤝 What We Do</h2>

          <div style={activityGrid}>
            {association.activities?.map((a, i) => (
              <div key={i} style={activityCard}>
                {a}
              </div>
            ))}
          </div>
        </section>

        {/* ================= TRANSPARENCY ================= */}
        <section style={trustSection}>
          <h2>🔍 Transparency & Governance</h2>
          <p>
            Our association follows transparent accounting, democratic
            decision-making, documented meetings, audited financials,
            and accountable leadership.
          </p>
          <p>
            Members can access complaints, suggestions, meetings,
            resolutions, and reports through our secure digital platform.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}

/* ================= STYLES ================= */

const loadingBox = {
  minHeight: "70vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  color: "#475569",
};

const page = {
  background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
  minHeight: "100vh",
};

const hero = {
  textAlign: "center",
  padding: "90px 20px 70px",
};

const logo = {
  width: 120,
  marginBottom: 20,
};

const title = {
  fontSize: 38,
  fontWeight: 800,
  color: "#0f172a",
};

const subtitle = {
  marginTop: 10,
  color: "#475569",
  fontSize: 16,
};

const ctaRow = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginTop: 30,
  flexWrap: "wrap",
};

const btnPrimary = {
  background: "linear-gradient(135deg,#2563eb,#1e40af)",
  color: "#fff",
  padding: "14px 30px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
  boxShadow: "0 10px 30px rgba(37,99,235,.4)",
};

const btnGhost = {
  border: "2px solid #2563eb",
  color: "#2563eb",
  padding: "12px 28px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
};

const highlightGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
  maxWidth: 1100,
  margin: "0 auto 60px",
  padding: "0 20px",
};

const highlightCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 18,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
  textAlign: "center",
};

const aboutSection = {
  maxWidth: 900,
  margin: "0 auto 60px",
  background: "#fff",
  padding: 32,
  borderRadius: 22,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};

const mvGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: 24,
  maxWidth: 1000,
  margin: "0 auto 60px",
  padding: "0 20px",
};

const mvCard = {
  background: "#fff",
  padding: 30,
  borderRadius: 22,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};

const activitySection = {
  textAlign: "center",
  marginBottom: 60,
};

const activityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  maxWidth: 900,
  margin: "30px auto 0",
  padding: "0 20px",
};

const activityCard = {
  background: "#fff",
  padding: 18,
  borderRadius: 14,
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  fontWeight: 600,
};

const trustSection = {
  maxWidth: 900,
  margin: "0 auto 80px",
  background: "#fff",
  padding: 30,
  borderRadius: 22,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};
