import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

  if (!settings) return <div style={{ padding: 40 }}>Loading...</div>;

  const t = (en, te) => (lang === "EN" ? en : te);

  const themes = {
    default: "linear-gradient(180deg,#fff7ed,#fef3c7,#eef2ff)",
    diwali: "linear-gradient(180deg,#1f2933,#7c2d12,#f59e0b)",
    ram: "linear-gradient(180deg,#eff6ff,#dbeafe,#93c5fd)",
    hanuman: "linear-gradient(180deg,#3f1d0b,#b45309,#f59e0b)",
  };

  return (
    <>
      <Navbar />

      {/* 🌐 Language Toggle */}
      <div style={langToggle}>
        <button onClick={() => setLang("EN")} style={lang==="EN"?langBtnActive:langBtn}>English</button>
        <button onClick={() => setLang("TE")} style={lang==="TE"?langBtnActive:langBtn}>తెలుగు</button>
      </div>

      <div style={{ ...page, background: themes[settings.theme] || themes.default }}>

        {/* 🕉️ Animated Slokam */}
        <motion.div
          initial={{ opacity:0, y:-20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:1.2 }}
          style={slokaWrap}
        >
          <motion.div
            animate={{ scale:[1,1.05,1] }}
            transition={{ repeat:Infinity, duration:4 }}
            style={slokaBox}
          >
            <p style={sloka}>
              సర్వే భవంతు సుఖినః  
              సర్వే సంతు నిరామయాః  
              సర్వే భద్రాణి పశ్యంతు  
              మా కశ్చిద్ దుఃఖ భాగ్భవేత్
            </p>
          </motion.div>
        </motion.div>

        {/* HERO */}
        <section style={hero}>
          {settings.logo_url && (
            <img
              src={import.meta.env.VITE_API_BASE_URL + settings.logo_url}
              alt="Logo"
              style={logo}
            />
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
                <h2 style={sectionTitle(settings.primary_color)}>
                  🌱 {t("About the Association","సంఘం గురించి")}
                </h2>
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

        </div>
      </div>

      <footer style={footer}>
        © 2026 Hinduswaraj Youth Welfare Association • Developed by Sreetech Technologies
      </footer>
    </>
  );
}

/* ================= STYLES ================= */

const page={minHeight:"100vh"};
const hero={textAlign:"center",padding:"80px 20px"};
const logo={width:130,marginBottom:20};
const title={fontSize:38,fontWeight:800};
const subtitle={marginTop:10,fontSize:16};
const ctaRow={display:"flex",justifyContent:"center",gap:16,marginTop:30};
const btnPrimary=c=>({background:`linear-gradient(135deg,${c},#7c2d12)`,color:"#fff",padding:"14px 32px",borderRadius:999,textDecoration:"none",fontWeight:700,boxShadow:"0 0 25px rgba(245,158,11,.8)"});
const btnGhost=c=>({border:`2px solid ${c}`,color:c,padding:"12px 28px",borderRadius:999,textDecoration:"none",fontWeight:600});
const content={maxWidth:1200,margin:"0 auto",padding:"0 24px"};
const section={marginBottom:80};
const mvGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:24};
const card={background:"#fff",padding:26,borderRadius:22,boxShadow:"0 20px 40px rgba(0,0,0,.1)"};
const cardWide={...card,padding:36};
const sectionTitle=c=>({textAlign:"center",marginBottom:24,color:c,fontSize:22,fontWeight:700});
const footer={textAlign:"center",padding:24,color:"#475569",fontSize:13};

const langToggle={position:"fixed",top:80,right:20,zIndex:1000,display:"flex",gap:8};
const langBtn={padding:"6px 12px",borderRadius:20,border:"1px solid #cbd5f5",background:"#fff"};
const langBtnActive={...langBtn,background:"#312e81",color:"#fff"};

const slokaWrap={display:"flex",justifyContent:"center",paddingTop:30};
const slokaBox={background:"linear-gradient(135deg,#fff7ed,#fde68a)",borderRadius:20,padding:"26px 40px",boxShadow:"0 10px 40px rgba(0,0,0,.15)"};
const sloka={fontSize:18,fontWeight:700,color:"#92400e",lineHeight:1.7};
