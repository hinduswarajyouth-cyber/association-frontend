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

  if (!settings) return <div style={{ padding: 80 }}>Loading…</div>;

  const t = (en, te) => (lang === "EN" ? en : te);

  return (
    <>
      <Navbar />

      {/* Language Switch */}
      <div style={langBox}>
        <button onClick={() => setLang("EN")} style={lang==="EN"?langActive:langBtn}>English</button>
        <button onClick={() => setLang("TE")} style={lang==="TE"?langActive:langBtn}>తెలుగు</button>
      </div>

      {/* HERO */}
      <section style={{...hero, background: settings.background_gradient}}>
        {settings.logo_url && (
          <img src={import.meta.env.VITE_API_BASE_URL + settings.logo_url} style={logo} />
        )}
        <h1>{t(settings.hero_title, settings.hero_title_te)}</h1>
        <p>{t(settings.hero_subtitle, settings.hero_subtitle_te)}</p>
        <div style={heroBtns}>
          <a href="/donate" style={btnPrimary}>🙏 {t("Donate","విరాళం ఇవ్వండి")}</a>
          <a href="/volunteer" style={btnGhost}>🤝 {t("Volunteer","వాలంటీర్")}</a>
        </div>
      </section>

      {/* ABOUT */}
      <section style={section}>
        <h2>🌱 {t("About Us","సంఘం గురించి")}</h2>
        <p>{t(settings.about_text, settings.about_text_te)}</p>
      </section>

      {/* MISSION VISION */}
      <section style={twoGrid}>
        <div style={card}><h3>🎯 {t("Mission","లక్ష్యం")}</h3><p>{t(settings.mission_text, settings.mission_text_te)}</p></div>
        <div style={card}><h3>🌍 {t("Vision","దృష్టి")}</h3><p>{t(settings.vision_text, settings.vision_text_te)}</p></div>
      </section>

      {/* WHAT WE DO */}
      <section style={sectionAlt}>
        <h2>🤝 {t("What We Do","మేము చేసే సేవలు")}</h2>
        <div style={grid}>
          {ACTIVITIES.map((a,i)=>(
            <div key={i} style={card}>
              {lang==="EN"?a.en:a.te}
            </div>
          ))}
        </div>
      </section>

      {/* DIGITAL TRANSPARENCY */}
      <section style={section}>
        <h2>🔐 {t("Digital Transparency","డిజిటల్ పారదర్శకత")}</h2>
        <p>
          {t(
            "Every donation is recorded digitally with QR verified receipts. Members can track all collections and expenses through our secure digital system.",
            "ప్రతి విరాళం డిజిటల్ రికార్డుల్లో నమోదు చేయబడుతుంది. QR కోడ్ రసీదులు మరియు సభ్యులకు పూర్తి లెక్కలు అందుబాటులో ఉంటాయి."
          )}
        </p>
      </section>

      {/* WHY TRUST US */}
      <section style={sectionAlt}>
        <h2>🛡️ {t("Why Trust Us","మమ్మల్ని ఎందుకు నమ్మాలి")}</h2>
        <div style={grid}>
          {TRUST.map((x,i)=>(
            <div key={i} style={card}>
              {lang==="EN"?x.en:x.te}
            </div>
          ))}
        </div>
      </section>

      {/* REGISTRATION */}
      <section style={section}>
        <h2>📜 {t("Legal Registration","చట్టబద్ధ నమోదు")}</h2>
        <p>
          {t(
            "Hinduswaraj Youth Welfare Association is a registered non-profit organization based in Jagtial, Telangana.",
            "హిందూ స్వరాజ్ యూత్ వెల్ఫేర్ అసోసియేషన్ జాగిత్యాలులో నమోదు చేయబడిన స్వచ్ఛంద సంస్థ."
          )}
        </p>
      </section>

      {/* MEMBERS & GALLERY */}
      <section style={sectionAlt}>
        <h2>👥 {t("Our Community","మా సంఘం")}</h2>
        <div style={twoGrid}>
          <a href="/members" style={cardLink}>{t("View Members","సభ్యులను చూడండి")}</a>
          <a href="/gallery" style={cardLink}>{t("View Gallery","గ్యాలరీ")}</a>
        </div>
      </section>

      {/* VOLUNTEER */}
      <section style={section}>
        <h2>🤝 {t("Become a Volunteer","వాలంటీర్ అవ్వండి")}</h2>
        <p>
          {t(
            "Join us in serving society through seva and youth empowerment.",
            "సేవ మరియు యువ శక్తి ద్వారా సమాజానికి సేవ చేయడానికి మాతో చేరండి."
          )}
        </p>
        <a href="/volunteer" style={btnPrimary}>Register Now</a>
      </section>

     
    </>
  );
}

/* DATA */
const ACTIVITIES = [
 {en:"Youth Leadership & Skill Development",te:"యువ నాయకత్వం & నైపుణ్యాభివృద్ధి"},
 {en:"Health & Blood Donation Camps",te:"ఆరోగ్య & రక్తదాన శిబిరాలు"},
 {en:"Environmental Cleanliness Drives",te:"పర్యావరణ పరిశుభ్రత"},
 {en:"Cultural & Social Awareness",te:"సాంస్కృతిక కార్యక్రమాలు"},
 {en:"Education Support",te:"విద్య మద్దతు"},
 {en:"Relief & Emergency Seva",te:"అత్యవసర సేవలు"}
];

const TRUST = [
 {en:"Government Registered NGO",te:"ప్రభుత్వ నమోదు పొందిన సంస్థ"},
 {en:"QR Verified Receipts",te:"QR ధృవీకరణ రసీదులు"},
 {en:"Digital Ledger System",te:"డిజిటల్ లెక్కల వ్యవస్థ"},
 {en:"Transparent Management",te:"పారదర్శక పాలన"}
];

/* STYLES */
const hero={padding:80,textAlign:"center",color:"#fff"};
const logo={width:120,marginBottom:20};
const heroBtns={display:"flex",justifyContent:"center",gap:20,marginTop:30};
const btnPrimary={background:"#0d47a1",color:"#fff",padding:"14px 40px",borderRadius:30,fontWeight:700};
const btnGhost={border:"2px solid #fff",color:"#fff",padding:"12px 36px",borderRadius:30};
const section={maxWidth:1100,margin:"80px auto",padding:"0 24px"};
const sectionAlt={...section,background:"#f8fafc",padding:"60px 24px"};
const twoGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:30,maxWidth:1100,margin:"0 auto"};
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24};
const card={background:"#fff",padding:30,borderRadius:18,boxShadow:"0 8px 24px rgba(0,0,0,.1)"};
const cardLink={...card,textAlign:"center",fontSize:20,fontWeight:700};
const footer={textAlign:"center",padding:40,color:"#64748b"};

const langBox={position:"fixed",top:80,right:20,display:"flex",gap:10};
const langBtn={padding:"6px 14px",borderRadius:20,background:"#fff"};
const langActive={...langBtn,background:"#1e3a8a",color:"#fff"};
