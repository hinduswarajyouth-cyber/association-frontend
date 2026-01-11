import Navbar from "../components/Navbar";
import logoImg from "../assets/logo.png";

export default function Association() {
  return (
    <>
      <Navbar />

      <div style={page}>
        {/* ================= HERO ================= */}
        <section style={hero}>
          <img
            src={logoImg}
            alt="Hinduswaraj Youth Welfare Association Logo"
            style={logo}
          />

          <h1 style={title}>
            Hinduswaraj Youth Welfare Association
          </h1>

          <p style={subtitle}>
            🕉️ Registered Non-Profit Organization • Empowering Youth • Serving Dharma & Society
          </p>

          <p style={mantra}>“सर्वे भवन्तु सुखिनः”</p>

          <div style={ctaRow}>
            <a href="/donate" style={btnPrimary}>
              🙏 Donate for Seva
            </a>
            <a href="/login" style={btnGhost}>
              Member Login
            </a>
          </div>
        </section>

        {/* ================= CONTENT WRAPPER ================= */}
        <div style={content}>
          {/* ================= HIGHLIGHTS ================= */}
          <section style={section}>
            <div style={highlightGrid}>
              <Highlight title="🏛 Registration" value="784/2025" note="Government Registered Trust" />
              <Highlight title="📅 Established" value="2012" note="Youth-Driven Organization" />
              <Highlight title="📍 Location" value="Jagtial" note="Telangana, Bharat 🇮🇳" />
              <Highlight title="📞 Contact" value="+91 84998 78425" note="info@hinduswarajyouth.online" />
            </div>
          </section>

          {/* ================= ABOUT ================= */}
          <section style={section}>
            <div style={cardWide}>
              <h2 style={sectionTitle}>🌱 About the Association</h2>
              <p>
                <b>Hinduswaraj Youth Welfare Association</b> is a community-driven,
                non-profit organization rooted in <b>Bharatiya values</b>,
                dedicated to empowering youth, promoting social responsibility,
                and serving society through structured welfare initiatives.
              </p>
              <p>
                Inspired by the ideals of <b>Seva</b>, <b>Sanghatan</b>, and <b>Sanskriti</b>,
                we work towards holistic development of individuals and communities.
              </p>
            </div>
          </section>

          {/* ================= MISSION / VISION ================= */}
          <section style={section}>
            <div style={mvGrid}>
              <div style={card}>
                <h3>🎯 Our Mission</h3>
                <p>
                  To nurture disciplined, responsible, and service-oriented youth
                  through education, leadership, welfare activities, and
                  community participation rooted in ethical and cultural values.
                </p>
              </div>

              <div style={card}>
                <h3>🌍 Our Vision</h3>
                <p>
                  To build a strong, self-reliant, and socially conscious generation
                  that contributes positively to national growth, social harmony,
                  and cultural preservation.
                </p>
              </div>
            </div>
          </section>

          {/* ================= ACTIVITIES ================= */}
          <section style={section}>
            <h2 style={sectionTitle}>🤝 What We Do</h2>
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
          <section style={section}>
            <h2 style={sectionTitle}>🕉️ Our Core Values</h2>
            <div style={valuesGrid}>
              <Value>Seva (Selfless Service)</Value>
              <Value>Discipline & Integrity</Value>
              <Value>Unity & Brotherhood</Value>
              <Value>Cultural Awareness</Value>
              <Value>Transparency & Accountability</Value>
            </div>
          </section>

          {/* ================= TRANSPARENCY ================= */}
          <section style={section}>
            <div style={cardWide}>
              <h2 style={sectionTitle}>🔍 Transparency & Governance</h2>
              <p>
                We follow transparent governance practices including documented meetings,
                audited financials, democratic decision-making, and accountable leadership.
              </p>
              <p>
                Members actively participate through our secure digital platform
                for meetings, complaints, suggestions, resolutions, and reports.
              </p>
            </div>
          </section>
        </div>
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
  <div style={card}>
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
};

const content = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
};

const section = {
  marginBottom: 80,
};

const hero = {
  textAlign: "center",
  padding: "90px 20px 80px",
};

const logo = {
  width: 140,
  marginBottom: 20,
};

const title = {
  fontSize: 40,
  fontWeight: 800,
  color: "#0f172a",
};

const subtitle = {
  marginTop: 10,
  color: "#92400e",
  fontSize: 16,
};

const mantra = {
  marginTop: 12,
  fontSize: 14,
  color: "#78350f",
  letterSpacing: 1,
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
  padding: "14px 32px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 700,
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
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 24,
};

const mvGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
  gap: 24,
};

const card = {
  background: "#fff",
  padding: 26,
  borderRadius: 22,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
  textAlign: "center",
};

const cardWide = {
  background: "#fff",
  padding: 36,
  borderRadius: 26,
  boxShadow: "0 20px 40px rgba(0,0,0,.08)",
};

const sectionTitle = {
  textAlign: "center",
  marginBottom: 20,
  color: "#0f172a",
};

const activityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const activityCard = {
  background: "#fff",
  padding: 22,
  borderRadius: 18,
  fontWeight: 600,
  boxShadow: "0 12px 28px rgba(0,0,0,.08)",
};

const valuesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 18,
};

const valueCard = {
  background: "linear-gradient(135deg,#fde68a,#f59e0b)",
  padding: 18,
  borderRadius: 16,
  fontWeight: 700,
  textAlign: "center",
};

const footer = {
  textAlign: "center",
  padding: 24,
  color: "#475569",
  fontSize: 13,
};
