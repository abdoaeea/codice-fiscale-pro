import React, { useState } from "react";
function extractConsonants(str) {
  return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, "").toUpperCase();
}
function extractVowels(str) {
  return str.replace(/[^AEIOU]/gi, "").toUpperCase();
}
function padRight(str, length) {
  return (str + "XXX").slice(0, length);
}
function codeName(str, isName = false) {
  let cons = extractConsonants(str);
  let vows = extractVowels(str);
  if (isName && cons.length >= 4) cons = cons[0] + cons[2] + cons[3];
  return padRight(cons + vows, 3);
}
const months = "ABCDEHLMPRST";
function codeMonth(month) {
  return months[parseInt(month, 10) - 1] || "X";
}
const comuni = {
  "ROMA": "H501", "MILANO": "F205", "NAPOLI": "F839", "TORINO": "L219", "PALERMO": "G273",
  "Z100": "Z100"
};
function codeComune(place) {
  place = place.trim().toUpperCase();
  return comuni[place] || "Z100";
}
function codeDay(day, gender) {
  let d = parseInt(day, 10);
  if (gender === "F") d += 40;
  return (d < 10 ? "0" : "") + d;
}
const setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
function controlChar(cf) {
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let c = cf[i];
    if ((i + 1) % 2 === 0) {
      sum += setpari.indexOf(c) !== -1 ? setpari.indexOf(c) : parseInt(c, 10);
    } else {
      sum += setdisp.indexOf(c) !== -1 ? setdisp.indexOf(c) : parseInt(setdisp[c] || c, 10);
    }
  }
  return setpari[sum % 26];
}
function codiceFiscale({ name, surname, gender, birthdate, birthplace }) {
  if (!name || !surname || !gender || !birthdate || !birthplace) return "";
  const date = new Date(birthdate);
  const year = ("" + date.getFullYear()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const s = codeName(surname);
  const n = codeName(name, true);
  const y = year;
  const m = codeMonth(month);
  const d = codeDay(day, gender);
  const c = codeComune(birthplace);
  const base = s + n + y + m + d + c;
  const ctrl = controlChar(base);
  return base + ctrl;
}
const locales = {
  it: {
    title: "Generatore Codice Fiscale Italiano",
    subtitle: "Facile, veloce, sicuro. Nessun dato viene salvato.",
    generate: "Genera",
    copy: "Copia",
    copied: "Copiato!",
    name: "Nome",
    surname: "Cognome",
    gender: "Sesso",
    birthdate: "Data di nascita",
    birthplace: "Luogo di nascita",
    male: "Maschio",
    female: "Femmina",
    code: "Codice Fiscale",
    resultNote: "Risultato non ufficiale. Verifica sempre presso Agenzia delle Entrate.",
    privacy: "Nessun dato viene conservato. Tutto resta sul tuo dispositivo."
  },
  en: {
    title: "Italian Tax Code Generator",
    subtitle: "Easy, fast, safe. No data is saved.",
    generate: "Generate",
    copy: "Copy",
    copied: "Copied!",
    name: "First Name",
    surname: "Last Name",
    gender: "Gender",
    birthdate: "Date of Birth",
    birthplace: "Place of Birth",
    male: "Male",
    female: "Female",
    code: "Tax Code",
    resultNote: "Unofficial result. Always verify at Agenzia delle Entrate.",
    privacy: "No data is stored. Everything stays on your device."
  }
};
export default function App() {
  const [lang, setLang] = useState("it");
  const t = locales[lang];
  const [form, setForm] = useState({
    name: "",
    surname: "",
    gender: "M",
    birthdate: "",
    birthplace: ""
  });
  const [cf, setCf] = useState("");
  const [copied, setCopied] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setCf(codiceFiscale(form));
    setCopied(false);
  }
  function handleCopy() {
    navigator.clipboard.writeText(cf);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc", color: "#222", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", padding: "2rem" }}>
      <div style={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "1rem" }}>CodiceFiscale Pro</div>
      <div>
        <select value={lang} onChange={e => setLang(e.target.value)} style={{ borderRadius: 8, padding: "2px 10px" }}>
          <option value="it">IT</option>
          <option value="en">EN</option>
        </select>
      </div>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px #0001", padding: 24, margin: "2rem 0" }}>
        <label>{t.name}<input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%", margin: "4px 0 12px", padding: 8, borderRadius: 8 }} /></label>
        <label>{t.surname}<input name="surname" value={form.surname} onChange={handleChange} required style={{ width: "100%", margin: "4px 0 12px", padding: 8, borderRadius: 8 }} /></label>
        <label>{t.birthdate}<input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} required style={{ width: "100%", margin: "4px 0 12px", padding: 8, borderRadius: 8 }} /></label>
        <label>{t.birthplace}<input name="birthplace" value={form.birthplace} onChange={handleChange} required placeholder="ROMA, MILANO, ..." style={{ width: "100%", margin: "4px 0 12px", padding: 8, borderRadius: 8 }} /></label>
        <label>{t.gender}
          <select name="gender" value={form.gender} onChange={handleChange} style={{ width: "100%", margin: "4px 0 12px", padding: 8, borderRadius: 8 }}>
            <option value="M">{t.male}</option>
            <option value="F">{t.female}</option>
          </select>
        </label>
        <button type="submit" style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#16a34a", color: "#fff", fontWeight: "bold", border: "none" }}>{t.generate}</button>
      </form>
      {cf && (
        <div style={{ background: "#e2e8f0", border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 16, fontFamily: "monospace", fontSize: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <span>{cf}</span>
          <button onClick={handleCopy} style={{ border: "none", background: "#fff", padding: "6px 14px", borderRadius: 8, cursor: "pointer" }}>{copied ? t.copied : t.copy}</button>
        </div>
      )}
      <div style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>{t.resultNote} <a href="https://www.agenziaentrate.gov.it/portale/web/guest/codice-fiscale" target="_blank" rel="noopener noreferrer">Agenzia delle Entrate</a></div>
      <div style={{ color: "#aaa", fontSize: 12 }}>{t.privacy}</div>
    </div>
  );
}
