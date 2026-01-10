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

  if (!settings) return <div style={{ padding: 50 }}>Loading…</div>;

  const t = (en, te) => (lang === "EN" ? en : te);

  return (
    <>
      <Navbar />

      {/* 🌐 Language Switch */}
      <div style={langToggle}>
        <button onClick={() => setLang("EN")} style={lang === "EN" ? langBtnActive : langBtn}>English</button>
        <button onClick={() => setLang("TE")} style={lang === "TE" ? langBtnActive : langBtn}>తెలుగు</button>
      </div>

      <div style={{ ...page, background: settings.background_gradient }}>

        {/* 🕉️ Temple Mantra */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          style={slokaOuter}
        >
          <motion.div
            animate={{ boxShadow: ["0 0 20px #f59e0b","0 0 80px #f59e0b","0 0 20px #f59e0b"] }}
            transition={{ repeat: Infinity, duration: 6 }}
            style={slokaInner}
          >
            <div style={slokaOm}>ॐ</div>
            <div style={slokaText}>
              సర్వే భవంతు సుఖినః<br/>
              సర్వే సంతు నిరామయాః<br/>
              సర్వే భద్రాణి పశ్యంతు<br/>
              మా కశ్చిద్ దుఃఖ భాగ్భవేత్
            </div>
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

          {/* WHAT WE DO */}
          {settings.show_activities && (
            <section style={section}>
              <h2 style={sectionTitle(settings.primary_color)}>🤝 {t("What We Do","మేము చేసే సేవలు")}</h2>
              <div style={grid}>
                {ACTIVITIES.map((a,i)=>(
                  <div key={i} style={serviceCard}>
                    {lang==="EN"?a.en:a.te}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TRANSPARENCY */}
          {settings.show_transparency && (
            <section style={section}>
              <div style={cardWide}>
                <h2 style={sectionTitle(settings.primary_color)}>🔍 {t("Transparency & Governance","పారదర్శకత & పాలన")}</h2>
                <p>
                  {t(
                    "We maintain audited accounts, public reports, democratic decision-making, and accountable leadership for every rupee received and spent.",
                    "ప్రతి రూపాయి ఎలా వస్తుందో, ఎలా ఖర్చు అవుతుందో స్పష్టమైన లెక్కలు, ప్రజాస్వామ్య నిర్ణయాలు మరియు బాధ్యతాయుతమైన పాలన పాటిస్తాము."
                  )}
                </p>
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
  {en:"Health, Welfare & Blood Donation Camps",te:"ఆరోగ్య & రక్తదాన శిబిరాలు"},
  {en:"Environmental & Cleanliness Drives",te:"పర్యావరణ & పరిశుభ్రత కార్యక్రమాలు"},
  {en:"Social Awareness & Cultural Programs",te:"సామాజిక & సాంస్కృతిక కార్యక్రమాలు"},
  {en:"Educational & Career Support",te:"విద్య & ఉపాధి మద్దతు"},
  {en:"Relief, Seva & Emergency Support",te:"సహాయం, సేవ & అత్యవసర మద్దతు"}
];

/* STYLES */
const page={minHeight:"100vh"};
const hero={textAlign:"center",padding:"90px 20px 70px"};
const logo={width:140,marginBottom:20};
const title={fontSize:52,fontWeight:900,textShadow:"0 0 40px rgba(245,158,11,.9)"};
const subtitle={fontSize:18,marginTop:10};
const ctaRow={display:"flex",justifyContent:"center",gap:16,marginTop:30};
const btnPrimary=c=>({background:"linear-gradient(135deg,#f59e0b,#b45309)",color:"#fff",padding:"16px 40px",borderRadius:999,fontWeight:800,boxShadow:"0 0 40px rgba(245,158,11,.9)"});
const btnGhost=c=>({border:`2px solid ${c}`,color:c,padding:"14px 30px",borderRadius:999,fontWeight:700});
const content={maxWidth:1200,margin:"0 auto",padding:"0 24px"};
const section={marginBottom:90};
const mvGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:24};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22};
const card={background:"#fff",padding:30,borderRadius:26,boxShadow:"0 20px 50px rgba(0,0,0,.12)"};
const cardWide={...card,padding:42};
const serviceCard={...card,fontWeight:800,textAlign:"center"};
const sectionTitle=c=>({textAlign:"center",marginBottom:34,color:c,fontSize:28,fontWeight:900});
const footer={textAlign:"center",padding:28,color:"#475569"};

const langToggle={position:"fixed",top:80,right:20,zIndex:1000,display:"flex",gap:8};
const langBtn={padding:"6px 14px",borderRadius:20,background:"#fff"};
const langBtnActive={...langBtn,background:"#312e81",color:"#fff"};

const slokaOuter={display:"flex",justifyContent:"center",marginTop:40};
const slokaInner={background:"linear-gradient(135deg,#fff7cc,#fde68a,#f59e0b)",padding:"40px 70px",borderRadius:50};
const slokaOm={fontSize:44,fontWeight:900,color:"#7c2d12"};
const slokaText={fontSize:22,fontWeight:900,color:"#78350f",lineHeight:1.8};
