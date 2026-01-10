import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Association() {
  const [settings, setSettings] = useState(null);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "EN");

  useEffect(() => {
    api.get("/association-settings/public").then(r => setSettings(r.data));
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  if (!settings) return <div style={{ padding: 50 }}>Loading...</div>;

  const t = (en, te) => (lang === "EN" ? en : te);

  return (
    <>
      <Navbar />

      {/* 🌐 Language Switch */}
      <div style={langToggle}>
        <button onClick={() => setLang("EN")} style={lang==="EN"?langBtnActive:langBtn}>English</button>
        <button onClick={() => setLang("TE")} style={lang==="TE"?langBtnActive:langBtn}>తెలుగు</button>
      </div>

      <div style={{ ...page, background: settings.background_gradient }}>

        {/* 🕉️ Simple Slokam */}
        <div style={slokaWrap}>
          “సర్వే భవంతు సుఖినః”
        </div>

        {/* HERO */}
        <section style={hero}>
          {settings.logo_url && (
            <img src={import.meta.env.VITE_API_BASE_URL + settings.logo_url} style={logo} />
          )}

          <h1 style={{ ...title, color: settings.primary_color }}>
            {t(settings.hero_title, settings.hero_title_te)}
          </h1>

          <p style={{ ...subtitle, color: settings.secondary_color }}>
            {t(settings.hero_subtitle, settings.hero_subtitle_te)}
          </p>

          <div style={ctaRow}>
            <a href="/donate" style={btnPrimary(settings.primary_color)}>
              🙏 {t("Donate for Seva","సేవకు విరాళం")}
            </a>
            <a href="/login" style={btnGhost(settings.primary_color)}>
              {t("Member Login","సభ్యుల లాగిన్")}
            </a>
          </div>
        </section>

        <div style={content}>

          {/* ABOUT */}
          {settings.show_about && (
            <section style={section}>
              <div style={cardWide}>
                <h2 style={sectionTitle(settings.primary_color)}>🌱 {t("About the Association","సంఘం గురించి")}</h2>
                <p>{t(settings.about_text, settings.about_text_te)}</p>
              </div>
            </section>
          )}

          {/* MISSION & VISION */}
          {settings.show_mission && (
            <section style={section}>
              <div style={mvGrid}>
                <div style={card}>
                  <h3>🎯 {t("Our Mission","మా లక్ష్యం")}</h3>
                  <p>{t(settings.mission_text, settings.mission_text_te)}</p>
                </div>
                <div style={card}>
                  <h3>🌍 {t("Our Vision","మా దృష్టి")}</h3>
                  <p>{t(settings.vision_text, settings.vision_text_te)}</p>
                </div>
              </div>
            </section>
          )}

          {/* WHY DONATE */}
          <section style={section}>
            <h2 style={sectionTitle(settings.primary_color)}>💛 {t("Why Donate","ఎందుకు విరాళం ఇవ్వాలి")}</h2>
            <div style={grid}>
              {WHY_DONATE.map((d,i)=>(
                <div key={i} style={card}>
                  <h4>{lang==="EN"?d.enTitle:d.teTitle}</h4>
                  <p>{lang==="EN"?d.en:d.te}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SEVA APPEAL */}
          <section style={section}>
            <div style={appealBox}>
              <h2>🙏 {t("Seva Appeal","సేవ విజ్ఞప్తి")}</h2>
              <p>{t(
                "Your small donation can bring food, education and hope to many lives.",
                "మీ చిన్న విరాళం అనేక జీవితాలకు ఆహారం, విద్య మరియు ఆశను అందిస్తుంది."
              )}</p>
              <a href="/donate" style={appealBtn}>
                🙏 {t("Donate Now","ఇప్పుడే విరాళం ఇవ్వండి")}
              </a>
            </div>
          </section>

          {/* WHAT WE DO */}
          {settings.show_activities && (
            <section style={section}>
              <h2 style={sectionTitle(settings.primary_color)}>🤝 {t("What We Do","మేము చేసే సేవలు")}</h2>
              <div style={grid}>
                {ACTIVITIES.map((a,i)=>(
                  <div key={i} style={card}>{lang==="EN"?a.en:a.te}</div>
                ))}
              </div>
            </section>
          )}

          {/* TRANSPARENCY */}
          {settings.show_transparency && (
            <section style={section}>
              <div style={cardWide}>
                <h2 style={sectionTitle(settings.primary_color)}>🔍 {t("Transparency & Governance","పారదర్శకత & పాలన")}</h2>
                <p>{t(
                  "We maintain audited accounts, public reports, and democratic decision-making for every rupee.",
                  "ప్రతి రూపాయి కోసం ఆడిట్ చేసిన లెక్కలు, ప్రజా నివేదికలు మరియు ప్రజాస్వామ్య నిర్ణయాలను పాటిస్తాము."
                )}</p>
              </div>
            </section>
          )}

        </div>
      </div>

      <footer style={footer}>
        © 2026 Hinduswaraj Youth Welfare Association • Developed by Sreetech Technologies
      </footer>
    </>
  );
}

/* DATA */
const ACTIVITIES = [
 {en:"Youth Leadership & Skill Development",te:"యువ నాయకత్వం & నైపుణ్యాభివృద్ధి"},
 {en:"Health & Blood Donation Camps",te:"ఆరోగ్య & రక్తదాన శిబిరాలు"},
 {en:"Environmental Cleanliness Drives",te:"పర్యావరణ & పరిశుభ్రత కార్యక్రమాలు"},
 {en:"Cultural & Social Awareness",te:"సాంస్కృతిక & సామాజిక కార్యక్రమాలు"},
 {en:"Education & Career Support",te:"విద్య & ఉపాధి మద్దతు"},
 {en:"Relief & Emergency Seva",te:"సహాయం & అత్యవసర సేవలు"}
];

const WHY_DONATE = [
 {enTitle:"Serve Humanity",teTitle:"మానవ సేవ",en:"Your donation helps poor families and patients.",te:"మీ విరాళం పేదలు మరియు రోగులకు సహాయం చేస్తుంది."},
 {enTitle:"Support Education",teTitle:"విద్యకు మద్దతు",en:"We support students with education and skills.",te:"విద్యార్థులకు చదువు మరియు నైపుణ్యాలు అందిస్తాము."},
 {enTitle:"Protect Dharma",teTitle:"ధర్మ పరిరక్షణ",en:"We preserve culture and spiritual values.",te:"సంస్కృతి మరియు ఆధ్యాత్మిక విలువలను కాపాడుతాము."}
];

/* STYLES */
const page={minHeight:"100vh"};
const hero={textAlign:"center",padding:"80px 20px"};
const logo={width:120,marginBottom:20};
const title={fontSize:42,fontWeight:900};
const subtitle={fontSize:18,marginTop:10};
const ctaRow={display:"flex",justifyContent:"center",gap:16,marginTop:30};
const btnPrimary=c=>({background:c,color:"#fff",padding:"14px 36px",borderRadius:999,fontWeight:700});
const btnGhost=c=>({border:`2px solid ${c}`,color:c,padding:"12px 30px",borderRadius:999});
const content={maxWidth:1200,margin:"0 auto",padding:"0 24px"};
const section={marginBottom:80};
const mvGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:24};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20};
const card={background:"#fff",padding:26,borderRadius:22,boxShadow:"0 10px 30px rgba(0,0,0,.1)"};
const cardWide={...card,padding:36};
const sectionTitle=c=>({textAlign:"center",marginBottom:30,color:c,fontSize:24,fontWeight:800});
const footer={textAlign:"center",padding:24,color:"#475569"};

const langToggle={position:"fixed",top:80,right:20,display:"flex",gap:8};
const langBtn={padding:"6px 14px",borderRadius:20,background:"#fff"};
const langBtnActive={...langBtn,background:"#312e81",color:"#fff"};

const slokaWrap={textAlign:"center",fontSize:18,fontWeight:600,color:"#92400e",marginTop:20};

const appealBox={background:"linear-gradient(135deg,#fde68a,#f59e0b)",padding:40,borderRadius:30,textAlign:"center"};
const appealBtn={display:"inline-block",marginTop:20,background:"#7c2d12",color:"#fff",padding:"14px 36px",borderRadius:999,fontWeight:800};
