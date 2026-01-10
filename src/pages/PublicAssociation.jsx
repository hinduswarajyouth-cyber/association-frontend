import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Association() {
  const [settings, setSettings] = useState(null);
  const [lang, setLang] = useState("EN");

  useEffect(() => {
    api.get("/association-settings/public").then(r => {
      setSettings(r.data);
    });
  }, []);

  if (!settings) return <div style={{ padding: 50 }}>Loading...</div>;

  const t = (en, te) => (lang === "EN" ? en : te);

  return (
    <>
      <Navbar />

      {/* 🌐 LANGUAGE TOGGLE */}
      <div style={langToggle}>
        <button
          onClick={() => setLang("EN")}
          style={lang === "EN" ? langBtnActive : langBtn}
        >
          English
        </button>
        <button
          onClick={() => setLang("TE")}
          style={lang === "TE" ? langBtnActive : langBtn}
        >
          తెలుగు
        </button>
      </div>

      <div
        style={{
          ...page,
          background:
            settings.background_gradient ||
            "linear-gradient(180deg,#fff7ed,#fef3c7,#eef2ff)",
        }}
      >
        {/* ================= HERO ================= */}
        <section style={hero}>
          {settings.logo_url && (
            <img
              src={import.meta.env.VITE_API_BASE_URL + settings.logo_url}
              alt="Association Logo"
              style={logo}
            />
          )}

          <h1 style={{ ...title, color: settings.primary_color }}>
            {t(settings.hero_title, settings.hero_title_te)}
          </h1>

          <p style={{ ...subtitle, color: settings.secondary_color }}>
            {t(settings.hero_subtitle, settings.hero_subtitle_te)}
          </p>

          <p style={mantra}>“सर्वे भवन्तु सुखिनः”</p>

          <div style={ctaRow}>
            <a href="/donate" style={btnPrimary(settings.primary_color)}>
              🙏 {t("Donate for Seva", "సేవకు విరాళం")}
            </a>
            <a href="/login" style={btnGhost(settings.primary_color)}>
              {t("Member Login", "సభ్యుల లాగిన్")}
            </a>
          </div>
        </section>

        <div style={content}>
          {/* ================= ABOUT ================= */}
          {settings.show_about && (
            <section style={section}>
              <div style={cardWide}>
                <h2 style={sectionTitle}>
                  🌱 {t("About the Association", "సంఘం గురించి")}
                </h2>
                <p>{t(settings.about_text, settings.about_text_te)}</p>
              </div>
            </section>
          )}

          {/* ================= MISSION / VISION ================= */}
          {(settings.show_mission || settings.show_values) && (
            <section style={section}>
              <div style={mvGrid}>
                {settings.show_mission && (
                  <div style={card}>
                    <h3>🎯 {t("Our Mission", "మా లక్ష్యం")}</h3>
                    <p>
                      {t(settings.mission_text, settings.mission_text_te)}
                    </p>
                  </div>
                )}

                {settings.show_values && (
                  <div style={card}>
                    <h3>🌍 {t("Our Vision", "మా దృష్టి")}</h3>
                    <p>
                      {t(settings.vision_text, settings.vision_text_te)}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ================= ACTIVITIES ================= */}
          {settings.show_activities && (
            <section style={section}>
              <h2 style={sectionTitle}>
                🤝 {t("What We Do", "మేము చేసే సేవలు")}
              </h2>
              <div style={activityGrid}>
                {DEFAULT_ACTIVITIES.map((a, i) => (
                  <div key={i} style={activityCard}>
                    {lang === "EN" ? a.en : a.te}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= TRANSPARENCY ================= */}
          {settings.show_transparency && (
            <section style={section}>
              <div style={cardWide}>
                <h2 style={sectionTitle}>
                  🔍 {t("Transparency & Governance", "పారదర్శకత & పాలన")}
                </h2>
                <p>
                  {t(
                    "We follow transparent governance practices including documented meetings, audited financials, democratic decision-making, and accountable leadership.",
                    "డాక్యుమెంటెడ్ సమావేశాలు, ఆడిట్ చేసిన ఆర్థిక నివేదికలు, ప్రజాస్వామ్య నిర్ణయాలు మరియు బాధ్యతాయుతమైన నాయకత్వంతో మేము పారదర్శక పాలనను పాటిస్తాము."
                  )}
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <footer style={footer}>
        © 2026 Hinduswaraj Youth Welfare Association • Developed by
        <b> Sreetech Technologies, Jagtial</b>
      </footer>
    </>
  );
}

/* ================= DATA ================= */

const DEFAULT_ACTIVITIES = [
  {
    en: "👨‍🎓 Youth Leadership & Skill Development",
    te: "👨‍🎓 యువ నాయకత్వం & నైపుణ్యాభివృద్ధి",
  },
  {
    en: "🏥 Health, Welfare & Blood Donation Camps",
    te: "🏥 ఆరోగ్య & రక్తదాన శిబిరాలు",
  },
  {
    en: "🌳 Environmental & Cleanliness Drives",
    te: "🌳 పర్యావరణ & పరిశుభ్రత కార్యక్రమాలు",
  },
  {
    en: "📢 Social Awareness & Cultural Programs",
    te: "📢 సామాజిక అవగాహన & సాంస్కృతిక కార్యక్రమాలు",
  },
  {
    en: "🏫 Educational & Career Support",
    te: "🏫 విద్య & ఉపాధి మద్దతు",
  },
  {
    en: "🤲 Relief, Seva & Emergency Support",
    te: "🤲 సహాయం, సేవ & అత్యవసర మద్దతు",
  },
];

/* ================= STYLES ================= */

const page = { minHeight: "100vh" };

const content = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
};

const section = { marginBottom: 80 };

const hero = {
  textAlign: "center",
  padding: "90px 20px 80px",
};

const logo = { width: 140, marginBottom: 20 };

const title = { fontSize: 40, fontWeight: 800 };

const subtitle = { marginTop: 10, fontSize: 16 };

const mantra = {
  marginTop: 12,
  fontSize: 14,
  letterSpacing: 1,
  color: "#78350f",
};

const ctaRow = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginTop: 30,
  flexWrap: "wrap",
};

const btnPrimary = color => ({
  background: `linear-gradient(135deg,${color},#000)`,
  color: "#fff",
  padding: "14px 32px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 700,
});

const btnGhost = color => ({
  border: `2px solid ${color}`,
  color,
  padding: "12px 28px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
});

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

const footer = {
  textAlign: "center",
  padding: 24,
  color: "#475569",
  fontSize: 13,
};

/* 🌐 LANGUAGE TOGGLE STYLES */

const langToggle = {
  position: "fixed",
  top: 80,
  right: 20,
  zIndex: 1000,
  display: "flex",
  gap: 8,
};

const langBtn = {
  padding: "6px 12px",
  borderRadius: 20,
  border: "1px solid #cbd5f5",
  background: "#fff",
  cursor: "pointer",
};

const langBtnActive = {
  ...langBtn,
  background: "#312e81",
  color: "#fff",
};
