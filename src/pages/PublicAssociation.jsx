import Navbar from "../components/Navbar";
import logoImg from "../assets/logo.png";

export default function Association() {
  return (
    <>
      <Navbar />

      <div style={page}>
        {/* ================= HERO ================= */}
        <section style={hero}>
          <img src={logoImg} alt="Hinduswaraj Youth Welfare Association Logo" style={logo} />

          <h1 style={title}>Hinduswaraj Youth Welfare Association</h1>

          <p style={subtitle}>
            🕉️ Registered Non-Profit Organization • Empowering Youth • Serving Dharma & Society
          </p>

          <p style={mantra}>“सर्वे भवन्तु सुखिनः”</p>

          <div style={ctaRow}>
            <a href="/donate" style={btnPrimary}>🙏 Donate for Seva</a>
            <a href="/login" style={btnGhost}>Member Login</a>
          </div>
        </section>

        <div style={content}>

{/* ================= HIGHLIGHTS ================= */}
<section style={section}>
  <div style={highlightGrid}>
    <Highlight title="🏛 Registration" value="784/2025" note="Government Registered Trust" />
    <Highlight title="📅 Established" value="2012" note="Serving society for 10+ years" />
    <Highlight title="📍 Location" value="Jagtial" note="Telangana, Bharat 🇮🇳" />
    <Highlight title="📞 Contact" value="+91 84998 78425" note="info@hinduswarajyouth.online" />
  </div>
</section>

{/* ================= ABOUT ================= */}
<section style={section}>
  <div style={cardWide}>
    <h2 style={sectionTitle}>🌱 About the Association</h2>
    <p>
      Hinduswaraj Youth Welfare Association is a registered non-profit organization formed
      by dedicated youth to serve society through education, welfare, cultural preservation
      and social upliftment.
    </p>
    <p>
      Rooted in Bharatiya values of Seva, Sanskruti and Sanghatan, we work for
      sustainable development and responsible citizenship.
    </p>
  </div>
</section>

{/* ================= OUR JOURNEY ================= */}
<section style={section}>
  <div style={cardWide}>
    <h2 style={sectionTitle}>📜 Our Journey</h2>
    <p>
      Starting as a small youth group in Jagtial, we have grown into a structured
      welfare organization conducting blood camps, education drives, relief activities
      and community programs across Telangana.
    </p>
    <p>
      With digital systems, QR receipts and transparent governance, we continue to
      expand our impact with integrity.
    </p>
  </div>
</section>

{/* ================= MISSION & VISION ================= */}
<section style={section}>
  <div style={mvGrid}>
    <div style={card}>
      <h3>🎯 Our Mission</h3>
      <p>
        To create disciplined, responsible and service-oriented youth through education,
        leadership and community participation.
      </p>
    </div>
    <div style={card}>
      <h3>🌍 Our Vision</h3>
      <p>
        To build a strong, self-reliant and culturally rooted society driven by youth leadership.
      </p>
    </div>
  </div>
</section>

{/* ================= WHAT WE DO ================= */}
<section style={section}>
  <h2 style={sectionTitle}>🤝 What We Do</h2>
  <div style={activityGrid}>
    <Activity>👨‍🎓 Youth Leadership & Skill Development</Activity>
    <Activity>🏥 Health, Welfare & Blood Donation Camps</Activity>
    <Activity>🌳 Environmental & Cleanliness Drives</Activity>
    <Activity>📢 Cultural & Social Awareness Programs</Activity>
    <Activity>🏫 Education & Career Support</Activity>
    <Activity>🤲 Disaster Relief & Emergency Seva</Activity>
  </div>
</section>

{/* ================= DIGITAL TRANSPARENCY ================= */}
<section style={section}>
  <div style={cardWide}>
    <h2 style={sectionTitle}>💻 Digital Transparency</h2>
    <p>
      Every donation is digitally recorded, approved by the Treasurer, and issued
      with QR verified receipts. Members can view collections, expenses and reports
      through the secure association portal.
    </p>
  </div>
</section>

{/* ================= WHY TRUST US ================= */}
<section style={section}>
  <h2 style={sectionTitle}>🛡️ Why Trust Us</h2>
  <div style={valuesGrid}>
    <Value>Government Registered NGO</Value>
    <Value>Audited Financial Records</Value>
    <Value>QR Verified Receipts</Value>
    <Value>Digital Ledger System</Value>
    <Value>Transparent Governance</Value>
  </div>
</section>

{/* ================= COMMUNITY ================= */}
<section style={section}>
  <div style={mvGrid}>
    <div style={card}>
      <h3>👥 Our Members</h3>
      <p>Dedicated youth, volunteers and professionals working together for society.</p>
      <a href="/members" style={btnPrimary}>View Members</a>
    </div>

    <div style={card}>
      <h3>📸 Our Gallery</h3>
      <p>Photos from blood camps, education drives, relief work and social programs.</p>
      <a href="/gallery" style={btnPrimary}>View Gallery</a>
    </div>
  </div>
</section>

{/* ================= VOLUNTEER ================= */}
<section style={section}>
  <div style={cardWide}>
    <h2 style={sectionTitle}>🙌 Become a Volunteer</h2>
    <p>Join us and contribute your time and skills for the betterment of society.</p>
    <a href="/volunteer" style={btnPrimary}>Register as Volunteer</a>
  </div>
</section>

{/* ================= LEGAL ================= */}
<section style={section}>
  <div style={cardWide}>
    <h2 style={sectionTitle}>📑 Legal Registration & Compliance</h2>
    <p>
      We are a legally registered welfare association following financial audits,
      government compliance and transparent reporting.
    </p>
  </div>
</section>

        </div>
      </div>

      <footer style={footer}>
        
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

const Activity = ({ children }) => <div style={activityCard}>{children}</div>;
const Value = ({ children }) => <div style={valueCard}>{children}</div>;

/* ================= YOUR ORIGINAL STYLES (UNCHANGED) ================= */

const page = {
  background: "linear-gradient(180deg,#fff7ed,#fef3c7,#eef2ff)",
  minHeight: "100vh",
};

const content = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const section = { marginBottom: 80 };
const hero = { textAlign: "center", padding: "90px 20px 80px" };
const logo = { width: 140, marginBottom: 20 };
const title = { fontSize: 40, fontWeight: 800, color: "#0f172a" };
const subtitle = { marginTop: 10, color: "#92400e", fontSize: 16 };
const mantra = { marginTop: 12, fontSize: 14, color: "#78350f", letterSpacing: 1 };
const ctaRow = { display: "flex", justifyContent: "center", gap: 16, marginTop: 30, flexWrap: "wrap" };

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

const highlightGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 };
const mvGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 24 };

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

const sectionTitle = { textAlign: "center", marginBottom: 20, color: "#0f172a" };

const activityGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 };
const activityCard = { background: "#fff", padding: 22, borderRadius: 18, fontWeight: 600, boxShadow: "0 12px 28px rgba(0,0,0,.08)" };

const valuesGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 };
const valueCard = { background: "linear-gradient(135deg,#fde68a,#f59e0b)", padding: 18, borderRadius: 16, fontWeight: 700, textAlign: "center" };

const footer = { textAlign: "center", padding: 24, color: "#475569", fontSize: 13 };
