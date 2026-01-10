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

  if (!settings) return <div style={{ padding: 50 }}>Loading...</div>;

  const t = (en, te) => (lang === "EN" ? en : te);

  return (
    <>
      <Navbar />

      {/* Language Toggle */}
      <div style={langToggle}>
        <button onClick={() => setLang("EN")} style={lang==="EN"?langActive:langBtn}>EN</button>
        <button onClick={() => setLang("TE")} style={lang==="TE"?langActive:langBtn}>TE</button>
      </div>

      {/* HERO */}
      <section style={hero}>
        <motion.h1 initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.8}}>
          {t(settings.hero_title, settings.hero_title_te)}
        </motion.h1>

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>
          {t(settings.hero_subtitle, settings.hero_subtitle_te)}
        </motion.p>

        <div style={{display:"flex",gap:20}}>
          <a href="/donate" style={btnPrimary}>Donate Now</a>
          <a href="/login" style={btnOutline}>Member Login</a>
        </div>
      </section>

      {/* ABOUT */}
      <section style={section}>
        <motion.div style={cardWide} whileHover={{y:-6}}>
          <h2>🌱 {t("About Us","మా గురించి")}</h2>
          <p>{t(settings.about_text, settings.about_text_te)}</p>
        </motion.div>
      </section>

      {/* Mission Vision */}
      <section style={section}>
        <div style={grid}>
          <motion.div style={card} whileHover={{scale:1.05}}>
            <h3>🎯 {t("Mission","లక్ష్యం")}</h3>
            <p>{t(settings.mission_text, settings.mission_text_te)}</p>
          </motion.div>
          <motion.div style={card} whileHover={{scale:1.05}}>
            <h3>🌍 {t("Vision","దృష్టి")}</h3>
            <p>{t(settings.vision_text, settings.vision_text_te)}</p>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section style={sectionDark}>
        <h2>🤝 {t("What We Do","మేము చేసే సేవలు")}</h2>
        <div style={grid}>
          {ACTIVITIES.map((a,i)=>(
            <motion.div key={i} style={card} whileHover={{y:-8}}>
              {lang==="EN"?a.en:a.te}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Digital Transparency */}
      <section style={section}>
        <motion.div style={cardWide}>
          <h2>🔐 Digital Transparency</h2>
          <p>
            Every donation is recorded digitally with QR verified receipts.
            Members can track all collections and expenses through our digital platform ensuring 100% transparency.
          </p>
        </motion.div>
      </section>

      {/* Why Trust Us */}
      <section style={sectionDark}>
        <h2>🛡️ Why Trust Us</h2>
        <div style={grid}>
          {TRUST.map((t,i)=>(
            <motion.div key={i} style={card} whileHover={{scale:1.05}}>
              {t}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Registration */}
      <section style={section}>
        <motion.div style={cardWide}>
          <h2>📜 Legal Registration</h2>
          <p>
            Hinduswaraj Youth Welfare Association is registered under Telangana NGO Act
            and follows audited financial and legal compliance.
          </p>
        </motion.div>
      </section>

      {/* Members & Gallery */}
      <section style={sectionDark}>
        <div style={{display:"flex",gap:20,justifyContent:"center"}}>
          <a href="/members" style={btnPrimary}>View Members</a>
          <a href="/gallery" style={btnPrimary}>View Gallery</a>
        </div>
      </section>

      {/* Volunteer */}
      <section style={section}>
        <motion.div style={cardWide}>
          <h2>🙌 Become a Volunteer</h2>
          <p>Join us and be part of Seva, Dharma & Social Service.</p>
          <a href="/volunteer" style={btnPrimary}>Register as Volunteer</a>
        </motion.div>
      </section>

      <footer style={footer}>
        © 2026 Hinduswaraj Youth Welfare Association
      </footer>
    </>
  );
}

/* DATA */
const ACTIVITIES = [
 {en:"Youth Leadership & Skill Development",te:"యువ నాయకత్వం & నైపుణ్యాభివృద్ధి"},
 {en:"Health & Blood Donation Camps",te:"ఆరోగ్య & రక్తదాన శిబిరాలు"},
 {en:"Environmental Cleanliness Drives",te:"పర్యావరణ కార్యక్రమాలు"},
 {en:"Cultural & Social Awareness",te:"సాంస్కృతిక సేవలు"},
 {en:"Education Support",te:"విద్య మద్దతు"},
 {en:"Relief & Emergency Seva",te:"అత్యవసర సేవలు"}
];

const TRUST = [
 "Government Registered NGO",
 "QR Verified Receipts",
 "Digital Ledger System",
 "Transparent Management"
];

/* STYLES */
const hero={
  minHeight:"90vh",
  background:"linear-gradient(135deg,#020617,#1e293b)",
  color:"#fff",
  display:"flex",
  flexDirection:"column",
  justifyContent:"center",
  alignItems:"center",
  textAlign:"center",
  gap:20
};

const section={padding:"80px 20px",background:"#f8fafc"};
const sectionDark={padding:"80px 20px",background:"#eef2ff"};

const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24,maxWidth:1100,margin:"auto"};

const card={background:"#fff",padding:28,borderRadius:20,boxShadow:"0 15px 40px rgba(0,0,0,.1)"};
const cardWide={...card,maxWidth:900,margin:"auto",textAlign:"center"};

const btnPrimary={background:"#f59e0b",padding:"14px 40px",borderRadius:999,fontWeight:800,color:"#000"};
const btnOutline={border:"2px solid #fff",padding:"14px 40px",borderRadius:999,color:"#fff"};

const footer={textAlign:"center",padding:30,background:"#020617",color:"#fff"};

const langToggle={position:"fixed",top:80,right:20,display:"flex",gap:10};
const langBtn={padding:"6px 14px",borderRadius:20};
const langActive={...langBtn,background:"#1e293b",color:"#fff"};
