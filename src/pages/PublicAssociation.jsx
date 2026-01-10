import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Association() {
  const [settings, setSettings] = useState(null);
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "EN"
  );

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    api.get("/association-settings/public").then(r => {
      setSettings(r.data);
    });
  }, []);

  if (!settings) return <div style={{ padding: 50 }}>Loading...</div>;

  const t = (en, te) => (lang === "EN" ? en : te || en);

  const sectionTitle = {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 22,
    fontWeight: 700,
    color: settings.primary_color,
  };

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
                <p>
                  {t(
                    settings.about_text ||
                      "Hinduswaraj Youth Welfare Association is a registered non-profit organization committed to youth empowerment, social service, and cultural preservation.",
                    settings.about_text_te
                  )}
                </p>
              </div>
            </section>
          )}

          {/* ================= MISSION & VISION ================= */}
          {(settings.show_mission || settings.show_values) && (
            <section style={section}>
              <div style={mvGrid}>
                {settings.show_mission && (
                  <div style={card}>
                    <h3>🎯 {t("Our Mission", "మా లక్ష్యం")}</h3>
                    <p>
                      {t(
                        settings.mission_text ||
                          "To empower disciplined and socially responsible youth through education, leadership, welfare initiatives, and service-oriented activities rooted in Bharatiya values.",
                        settings.mission_text_te
                      )}
                    </p>
                  </div>
                )}

                {settings.show_values && (
                  <div style={card}>
                    <h3>🌍 {t("Our Vision", "మా దృష్టి")}</h3>
                    <p>
                      {t(
                        settings.vision_text ||
                          "To build a strong, self-reliant, and culturally conscious generation that actively contributes to social harmony and national development.",
                        settings.vision_text_te
                      )}
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
    </>
  );
}

/* ================= LANGUAGE TOGGLE STYLES ================= */

const langToggle = {
  position: "fixed",
  top: 80,
  right: 20,
  zIndex: 1000,
  display: "flex",
  gap: 8,
};

const langBtn = {
  padding: "6px 14px",
  borderRadius: 20,
  border: "1px solid #cbd5f5",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const langBtnActive = {
  ...langBtn,
  background: "#312e81",
  color: "#fff",
};
