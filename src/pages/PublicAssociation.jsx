import Navbar from "../components/Navbar";

export default function Association() {
  return (
    <>
      <Navbar />

      <div style={page}>
        {/* ================= HERO ================= */}
        <section style={hero}>
          <img
            src="/logo.png"
            alt="Hinduswaraj Youth Welfare Association Logo"
            style={logo}
          />

          <h1 style={title}>
            Hinduswaraj Youth Welfare Association
          </h1>

          <p style={subtitle}>
            🕉️ Registered Non-Profit Organization • Empowering Youth • Serving Dharma & Society
          </p>

          <div style={ctaRow}>
            <a href="/donate" style={btnPrimary}>
              🙏 Donate for Seva
            </a>
            <a href="/login" style={btnGhost}>
              Member Login
            </a>
          </div>
        </section>

        {/* ================= HIGHLIGHTS ================= */}
        <section style={highlightGrid}>
          <Highlight title="🏛 Registration" value="REG-2023-HSY" note="Government Registered Trust" />
          <Highlight title="📅 Established" value="2023" note="Youth-Driven Organization" />
          <Highlight title="📍 Location" value="Jagtial" note="Telangana, Bharat 🇮🇳" />
          <Highlight title="📞 Contact" value="+91 98765 43210" note="info@hinduswarajyouth.online" />
        </section>

        {/* ================= ABOUT ================= */}
        <section style={aboutSection}>
          <h2>🌱 About the Association</h2>
          <p>
            <b>Hinduswaraj Youth Welfare Association</b> is a community-driven,
            non-profit organization rooted in <b>Bharatiya values</b>,
            dedicated to empowering youth, promoting social responsibility,
            and serving society through structured welfare initiatives.
          </p>

          <p>
            Inspired by the ideals of <b>Seva (Service)</b>, <b>Sanghatan (Unity)</b>,
            and <b>Sanskriti (Culture)</b>, the association works towards
            holistic development of individuals and communities.
          </p>
        </section>

        {/* ================= MISSION / VISION ================= */}
        <section style={mvGrid}>
          <div style={mvCard}>
            <h3>🎯 Our Mission</h3>
            <p>
              To nurture disciplined, responsible, and service-oriented youth
              through education, leadership, welfare activities, and
              community participation rooted in ethical and cultural values.
            </p>
          </div>

          <div style={mvCard}>
            <h3>🌍 Our Vision</h3>
            <p>
              To build a strong, self-reliant, and socially conscious generation
              that contributes positively to national growth, social harmony,
              and cultural preservation.
            </p>
          </div>
        </section>

        {/* ================= ACTIVITIES ================= */}
        <section style={activitySection}>
          <h2>🤝 What We Do</h2>

          <div style={activityGrid}>
            <Activity>👨‍🎓 Youth Leadership & Skill Development</Activity>
            <Activity>🏥 Health, Welfare & Blood Donation Camps</Activity>
            <Activity>🌳 Environmental & Cleanliness Drives</Activity>
            <Activity>📢 Social Awareness & Cultural Programs</Activity>
            <Activity>🏫 Educational & Career Support</Activity>
            <Activity>🤲 Relief, Seva & Emergency Support</Activity>
          </div>
        </section>

        {/* ================= VALUES ================= */}
        <section style={valuesSection}>
          <h2>🕉️ Our Core Values</h2>

          <div style={valuesGrid}>
            <Value>Seva (Selfless Service)</Value>
            <Value>Discipline & Integrity</Value>
            <Value>Unity & Brotherhood</Value>
            <Value>Cultural Awareness</Value>
            <Value>Transparency & Accountability</Value>
          </div>
        </section>

        {/* ================= TRANSPARENCY ================= */}
        <section style={trustSection}>
          <h2>🔍 Transparency & Governance</h2>
          <p>
            We follow transparent governance practices including
            documented meetings, audited financials, democratic
            decision-making, and accountable leadership.
          </p>
          <p>
            Members actively participate through our secure digital
            platform for meetings, complaints, suggestions, resolutions,
            and reports.
          </p>
        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <footer style={footer}>
        © 2026 Hinduswaraj Youth Welfare Association • Developed by
        <b> Sreetech Technologies, Jagtial</b>
      </footer>
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Highlight = ({ title, value, note }) => (
  <div style={highlightCard}>
    <h3>{title}</h3>
    <p><b>{value}</b></p>
    <small>{note}</small>
  </div>
);

const Activity = ({ children }) => (
  <div style={activityCard}>{children}</div>
);

const Value = ({ children }) => (
  <div style={valueCard}>{children}</div>
);

/* ================= STYLES ================= */

const page = {
  background: "linear-gradient(180deg,#fff7ed,#fef3c7,#eef2ff)",
  minHeight: "100vh",
  paddingBottom: 60,
};

const hero = {
  textAlign: "center",
  padding: "90px 20px 70px",
};

const logo = {
  width: 130,
  marginBottom: 20,
};

const title = {
  fontSize: 38,
  fontWeight: 800,
  color: "#0f172a",
};

const subtitle = {
  marginTop: 10,
  color: "#92400e",
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
  background: "linear-gradient(135deg,#f59e0b,#b45309)",
  color: "#fff",
  padding: "14px 30px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 700,
  boxShadow: "0 12px 30px rgba(245,158,11,.5)",
};

const btnGhost = {
  border: "2px solid #b45309",
  color: "#b45309",
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
  margin: "0 auto 70px",
  padding: "0 20px",
};

const highlightCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 20,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
  textAlign: "center",
};

const aboutSection = {
  maxWidth: 900,
  margin: "0 auto 70px",
  background: "#fff",
  padding: 34,
  borderRadius: 22,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};

const mvGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: 24,
  maxWidth: 1000,
  margin: "0 auto 70px",
  padding: "0 20px",
};

const mvCard = {
  background: "#fff",
  padding: 32,
  borderRadius: 22,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};

const activitySection = {
  textAlign: "center",
  marginBottom: 70,
};

const activityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 18,
  maxWidth: 900,
  margin: "30px auto 0",
  padding: "0 20px",
};

const activityCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 12px 28px rgba(0,0,0,.08)",
  fontWeight: 600,
};

const valuesSection = {
  textAlign: "center",
  marginBottom: 70,
};

const valuesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 16,
  maxWidth: 800,
  margin: "30px auto 0",
  padding: "0 20px",
};

const valueCard = {
  background: "linear-gradient(135deg,#fde68a,#f59e0b)",
  padding: 18,
  borderRadius: 14,
  fontWeight: 700,
};

const trustSection = {
  maxWidth: 900,
  margin: "0 auto 60px",
  background: "#fff",
  padding: 34,
  borderRadius: 22,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};

const footer = {
  marginTop: 60,
  textAlign: "center",
  padding: 20,
  color: "#475569",
  fontSize: 13,
};
