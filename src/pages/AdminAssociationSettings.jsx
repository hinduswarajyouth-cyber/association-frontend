import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function AdminAssociationSettings() {
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD SETTINGS ================= */
  useEffect(() => {
    api.get("/association-settings/admin").then(r => {
      setForm(r.data || {});
      setPreview(r.data?.logo_url || null);
    });
  }, []);

  if (!form) return <div style={{ padding: 40 }}>Loading...</div>;

  /* ================= SAVE ================= */
  const save = async () => {
    setSaving(true);
    await api.put("/association-settings/admin", form);
    setSaving(false);
    alert("✅ Association page updated");
  };

  /* ================= LOGO UPLOAD ================= */
  const uploadLogo = async () => {
    if (!image) return alert("Please select an image");

    const fd = new FormData();
    fd.append("logo", image);

    const r = await api.post("/association-settings/logo", fd);
    setForm({ ...form, logo_url: r.data.logo_url });
    setPreview(r.data.logo_url);
    setImage(null);
  };

  return (
    <>
      <Navbar />

      <div style={page}>
        <h2>🏛 Association CMS Settings</h2>

        {/* ================= LOGO ================= */}
        <section style={section}>
          <h3>🖼 Logo</h3>

          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
          />
          <button onClick={uploadLogo} style={btnSecondary}>
            Upload Logo
          </button>

          {preview && (
            <div style={{ marginTop: 12 }}>
              <img src={preview} alt="Logo Preview" style={{ width: 120 }} />
            </div>
          )}
        </section>

        {/* ================= HERO ================= */}
        <section style={section}>
          <h3>🎯 Hero Section</h3>

          <input
            value={form.hero_title || ""}
            onChange={e => setForm({ ...form, hero_title: e.target.value })}
            placeholder="Hero Title"
            style={input}
          />

          <textarea
            value={form.hero_subtitle || ""}
            onChange={e => setForm({ ...form, hero_subtitle: e.target.value })}
            placeholder="Hero Subtitle"
            style={textarea}
          />
        </section>

        {/* ================= THEME ================= */}
        <section style={section}>
          <h3>🎨 Theme</h3>

          <label>
            Primary Color
            <input
              type="color"
              value={form.primary_color || "#f59e0b"}
              onChange={e =>
                setForm({ ...form, primary_color: e.target.value })
              }
            />
          </label>

          <label style={{ marginLeft: 20 }}>
            Secondary Color
            <input
              type="color"
              value={form.secondary_color || "#92400e"}
              onChange={e =>
                setForm({ ...form, secondary_color: e.target.value })
              }
            />
          </label>

          <textarea
            value={form.background_gradient || ""}
            onChange={e =>
              setForm({ ...form, background_gradient: e.target.value })
            }
            placeholder="Background Gradient CSS"
            style={textarea}
          />
        </section>

        {/* ================= CONTENT (MULTI-LANGUAGE) ================= */}
        <section style={section}>
          <h3>📝 Content – English</h3>

          <textarea
            value={form.about_text || ""}
            onChange={e => setForm({ ...form, about_text: e.target.value })}
            placeholder="About (English)"
            style={textarea}
          />

          <textarea
            value={form.mission_text || ""}
            onChange={e => setForm({ ...form, mission_text: e.target.value })}
            placeholder="Mission (English)"
            style={textarea}
          />

          <textarea
            value={form.vision_text || ""}
            onChange={e => setForm({ ...form, vision_text: e.target.value })}
            placeholder="Vision (English)"
            style={textarea}
          />
        </section>

        <section style={section}>
          <h3>📝 Content – తెలుగు</h3>

          <textarea
            value={form.about_text_te || ""}
            onChange={e =>
              setForm({ ...form, about_text_te: e.target.value })
            }
            placeholder="About (తెలుగు)"
            style={textarea}
          />

          <textarea
            value={form.mission_text_te || ""}
            onChange={e =>
              setForm({ ...form, mission_text_te: e.target.value })
            }
            placeholder="Mission (తెలుగు)"
            style={textarea}
          />

          <textarea
            value={form.vision_text_te || ""}
            onChange={e =>
              setForm({ ...form, vision_text_te: e.target.value })
            }
            placeholder="Vision (తెలుగు)"
            style={textarea}
          />
        </section>

        {/* ================= VISIBILITY ================= */}
        <section style={section}>
          <h3>👁️ Section Visibility</h3>

          {[
            "show_about",
            "show_mission",
            "show_activities",
            "show_values",
            "show_transparency",
          ].map(k => (
            <label key={k} style={check}>
              <input
                type="checkbox"
                checked={!!form[k]}
                onChange={e =>
                  setForm({ ...form, [k]: e.target.checked })
                }
              />
              {k.replace("show_", "").toUpperCase()}
            </label>
          ))}
        </section>

        <button onClick={save} style={btnPrimary} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 30,
  maxWidth: 900,
  margin: "0 auto",
};

const section = {
  marginBottom: 30,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const textarea = {
  width: "100%",
  height: 90,
  marginBottom: 10,
  padding: 10,
};

const check = {
  display: "block",
  marginBottom: 6,
};

const btnPrimary = {
  background: "#f59e0b",
  color: "#fff",
  padding: "12px 24px",
  borderRadius: 6,
  border: "none",
  fontWeight: 600,
};

const btnSecondary = {
  background: "#2563eb",
  color: "#fff",
  padding: "8px 16px",
  marginLeft: 10,
  borderRadius: 6,
  border: "none",
};
