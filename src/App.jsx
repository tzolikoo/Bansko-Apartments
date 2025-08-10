
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Images, X, Bed, Bath, Users, Ruler, Wifi, Car, Snowflake, Sparkles, Lock, Edit3, Save } from "lucide-react";

const CONTACT_WHATSAPP = "972537221762";
const ADMIN_PASS_HASH = "4a5f5986b377fa9a216cef42524d78fd8304d3e34c9fef09d00243f6ce1ba618";

const FALLBACK_SITE = {
  brand: "צוליקו — דירות בבנסקו",
  heroTitle: "מצאו דירה קרובה לגונדולה בבנסקו",
  heroSubtitle: "גלריה פשוטה — לוחצים לתמונות, או לשלוח לי וואטסאפ לקבלת הצעה.",
  contactCtaText: "יש לכם דירה בבנסקו?",
  contactCtaSub: "לקבלת הצעה — פנו אליי בפרטי והוסיפו תמונות, שם הבניין ומרחק מהגונדולה.",
  footerText: "© 2025 צוליקו • Bansko"
};

const FALLBACK_APTS = [
  {
    id: "sample",
    name: "דירת הדגמה",
    location: "קרוב לגונדולה",
    distanceToGondolaM: 200,
    bedrooms: 1,
    bathrooms: 1,
    capacity: 3,
    sizeSqm: 55,
    amenities: ["wifi", "heating", "parking"],
    images: ["/photos/alpine-1.jpg"],
  },
];

const meters = (m) => (m != null ? `${m} מ' מהגונדולה` : "");

function labelAmenity(a) {
  switch (a) {
    case "wifi": return "אינטרנט";
    case "parking": return "חנייה";
    case "heating": return "חימום";
    case "ac": return "מיזוג";
    case "bed": return "מיטות";
    case "bath": return "מקלחת";
    default: return a;
  }
}

function AmenityIcon({ a }) {
  const map = {
    wifi: <Wifi className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />,
    heating: <Snowflake className="w-4 h-4" />,
    ac: <Snowflake className="w-4 h-4" />,
    bed: <Bed className="w-4 h-4" />,
    bath: <Bath className="w-4 h-4" />,
  };
  return <span className="inline-flex items-center gap-1 text-xs text-white/80">{map[a] || <Sparkles className="w-4 h-4" />}<span>{labelAmenity(a)}</span></span>;
}

async function sha256Hex(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function Header({ onAdminClick, admin, site }) {
  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" dir="rtl">
        <h1 className="text-white text-xl font-semibold">{site.brand}</h1>
        <div className="flex items-center gap-3">
          <button onClick={onAdminClick} title="כניסת מנהל" className="text-white/70 hover:text-white inline-flex items-center gap-1">
            <Lock className="w-4 h-4" /> {admin ? "מצב ניהול" : "כניסת מנהל"}
          </button>
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("היי, אשמח לעזרה במציאת דירה בבנסקו")}`}
            target="_blank" rel="noreferrer"
            className="text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-3 py-2"
          >
            צור קשר
          </a>
        </div>
      </div>
    </header>
  );
}

function Card({ apt, onGallery, admin, onEdit }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <button onClick={() => (admin ? onEdit(apt) : onGallery(apt))} className="block w-full text-left">
        <img src={apt.images?.[0]} alt={apt.name} className="w-full h-52 object-cover" />
      </button>
      <div className="p-4 space-y-3" dir="rtl">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => (admin ? onEdit(apt) : onGallery(apt))} className="text-white font-semibold text-lg text-right hover:underline">
            {apt.name}
          </button>
        </div>
        <div className="text-white/80 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{apt.location}</span>
          {apt.distanceToGondolaM != null ? <span className="text-white/60">• {meters(apt.distanceToGondolaM)}</span> : null}
        </div>
        <div className="text-white/70 text-sm flex flex-wrap gap-3">
          {apt.bedrooms != null && <span className="inline-flex items-center gap-1"><Bed className="w-4 h-4" />{apt.bedrooms} חדרי שינה</span>}
          {apt.bathrooms != null && <span className="inline-flex items-center gap-1"><Bath className="w-4 h-4" />{apt.bathrooms} מקלחות</span>}
          {apt.capacity != null && <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" />עד {apt.capacity} אורחים</span>}
          {apt.sizeSqm != null && <span className="inline-flex items-center gap-1"><Ruler className="w-4 h-4" />{apt.sizeSqm} מ״ר</span>}
        </div>
        {apt.amenities?.length ? (
          <div className="flex flex-wrap gap-2">
            {apt.amenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                <AmenityIcon a={a} />
              </span>
            ))}
          </div>
        ) : null}
        <div className="pt-1 text-white/60 text-sm">לקבלת הצעה — פנו אליי בפרטי</div>
        <div className="flex gap-2">
          <a
            className="flex-1 text-center bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2"
            href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(`היי! מעוניין/ת בדירה: ${apt.name}. קישור: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            דברו איתי ב‑WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Gallery({ apt, onClose }) {
  if (!apt) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-white text-lg font-semibold">{apt.name}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
          {apt.images?.map((src, i) => (
            <img key={i} src={src} alt={`${apt.name} ${i+1}`} className="w-full h-56 object-cover rounded-lg border border-white/10" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function AdminLoginModal({ onClose, onOk }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    const h = await sha256Hex(pass);
    if (h === ADMIN_PASS_HASH) { onOk(); onClose(); }
    else setError("סיסמה שגויה");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-sm w-full bg-zinc-900 border border-white/10 rounded-2xl p-4" onClick={(e)=>e.stopPropagation()} dir="rtl">
        <div className="text-white text-lg font-semibold mb-2">כניסת מנהל</div>
        <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" placeholder="סיסמה" />
        {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white">בטל</button>
          <button onClick={submit} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white">כניסה</button>
        </div>
      </div>
    </div>
  );
}

function EditAptModal({ apt, onClose, onSave }) {
  const [draft, setDraft] = useState(apt);
  const [newImg, setNewImg] = useState("");

  if (!apt) return null;

  const addImg = () => { if (!newImg.trim()) return; setDraft({ ...draft, images: [...(draft.images || []), newImg.trim()] }); setNewImg(""); };
  const removeImg = (idx) => { const arr = [...(draft.images || [])]; arr.splice(idx, 1); setDraft({ ...draft, images: arr }); };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl w-full bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-white text-lg font-semibold">עריכת דירה: {apt.name}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <label className="text-sm text-white/80 flex flex-col">שם הדירה<input className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft.name} onChange={(e)=>setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="text-sm text-white/80 flex flex-col">מיקום<input className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft.location || ""} onChange={(e)=>setDraft({ ...draft, location: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-white/80 flex flex-col">מרחק מהגונדולה (מ׳)<input type="number" className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft.distanceToGondolaM ?? ""} onChange={(e)=>setDraft({ ...draft, distanceToGondolaM: e.target.value? Number(e.target.value): undefined })} /></label>
            <label className="text-sm text-white/80 flex flex-col">מ״ר<input type="number" className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft.sizeSqm ?? ""} onChange={(e)=>setDraft({ ...draft, sizeSqm: e.target.value? Number(e.target.value): undefined })} /></label>
            <label className="text-sm text-white/80 flex flex-col">חדרי שינה<input type="number" className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft.bedrooms ?? ""} onChange={(e)=>setDraft({ ...draft, bedrooms: e.target.value? Number(e.target.value): undefined })} /></label>
            <label className="text-sm text-white/80 flex flex-col">מקלחות<input type="number" className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft.bathrooms ?? ""} onChange={(e)=>setDraft({ ...draft, bathrooms: e.target.value? Number(e.target.value): undefined })} /></label>
            <label className="text-sm text-white/80 flex flex-col">עד כמה אורחים<input type="number" className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft.capacity ?? ""} onChange={(e)=>setDraft({ ...draft, capacity: e.target.value? Number(e.target.value): undefined })} /></label>
          </div>

          <div className="text-white/90">תמונות</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(draft.images || []).map((src, i) => (
              <div key={i} className="relative">
                <img src={src} className="w-full h-28 object-cover rounded-lg border border-white/10" />
                <button onClick={()=>removeImg(i)} className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded">מחק</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" placeholder="/photos/שם-קובץ.jpg" value={newImg} onChange={(e)=>setNewImg(e.target.value)} />
            <button onClick={addImg} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white inline-flex items-center gap-2"><Images className="w-4 h-4" /> הוסף</button>
          </div>

          <div className="pt-2 text-white/60 text-xs">העלאת קבצים בפועל מתבצעת דרך GitHub → public/photos. כאן רק עורכים את שמות הקבצים ואז מורידים JSON מעודכן.</div>

          <div className="flex justify-end gap-2 pt-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white">בטל</button>
            <button onClick={()=>onSave(draft)} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white inline-flex items-center gap-2"><Save className="w-4 h-4" /> שמור</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function EditSiteModal({ site, onClose, onSave }) {
  const [draft, setDraft] = useState(site);
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-2xl w-full bg-zinc-900 border border-white/10 rounded-2xl p-4" onClick={(e)=>e.stopPropagation()} dir="rtl">
        <div className="text-white text-lg font-semibold mb-3">עריכת טקסטים באתר</div>
        {[
          ["brand","שם המותג"],["heroTitle","כותרת ראשית"],["heroSubtitle","כותרת משנה"],["contactCtaText","כותרת בלוק יצירת קשר"],["contactCtaSub","תיאור בלוק יצירת קשר"],["footerText","כיתוב פוטר"]
        ].map(([key,label]) => (
          <label key={key} className="text-sm text-white/80 flex flex-col mb-2">
            {label}
            <input className="mt-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white" value={draft[key] || ""} onChange={(e)=>setDraft({...draft, [key]: e.target.value})} />
          </label>
        ))}
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white">בטל</button>
          <button onClick={()=>onSave(draft)} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white inline-flex items-center gap-2"><Save className="w-4 h-4" /> שמור</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [site, setSite] = useState(FALLBACK_SITE);
  const [apts, setApts] = useState(FALLBACK_APTS);
  const [openGallery, setOpenGallery] = useState(null);
  const [openEdit, setOpenEdit] = useState(null);
  const [openSiteEdit, setOpenSiteEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/site.json', { cache: 'no-store' }).then(r=>r.ok?r.json():FALLBACK_SITE).catch(()=>FALLBACK_SITE),
      fetch('/apartments.json', { cache: 'no-store' }).then(r=>r.ok?r.json():FALLBACK_APTS).catch(()=>FALLBACK_APTS),
    ]).then(([s,a])=>{ setSite(s); setApts(a); }).finally(()=>setLoading(false));

    const stored = localStorage.getItem('admin') === '1';
    setAdmin(stored);
  }, []);

  const saveApartments = (draft) => {
    const idx = apts.findIndex(a => a.id === draft.id);
    const next = [...apts];
    if (idx >= 0) next[idx] = draft; else next.push(draft);
    setApts(next);
    setOpenEdit(null);
    const blob = new Blob([JSON.stringify(next, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'apartments.json'; a.click(); URL.revokeObjectURL(url);
  };

  const saveSite = (draft) => {
    setSite(draft);
    setOpenSiteEdit(false);
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'site.json'; a.click(); URL.revokeObjectURL(url);
  };

  const handleAdminClick = () => { if (admin) { setAdmin(false); localStorage.removeItem('admin'); return; } setShowLogin(true); };
  const onAdminOk = () => { setAdmin(true); localStorage.setItem('admin', '1'); setShowLogin(false); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-900 text-white" dir="rtl">
      <Header onAdminClick={handleAdminClick} admin={admin} site={site} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <section className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold">{site.heroTitle}</h2>
          <p className="text-white/70">{site.heroSubtitle}</p>
          {admin && <button onClick={()=>setOpenSiteEdit(true)} className="text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1 inline-flex items-center gap-1"><Edit3 className="w-3 h-3" /> עריכת טקסטים</button>}
        </section>
        {loading ? (
          <div className="text-center text-white/70 py-16">טוען דירות…</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {apts.map((a) => (
              <motion.div key={a.id} layout>
                <Card apt={a} admin={admin} onGallery={(apt)=>setOpenGallery(apt)} onEdit={(apt)=>setOpenEdit(apt)} />
              </motion.div>
            ))}
          </div>
        )}

        <section id="contact" className="mt-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4" dir="rtl">
            <div>
              <h3 className="text-lg font-semibold">{site.contactCtaText}</h3>
              <p className="text-white/70 text-sm">{site.contactCtaSub}</p>
            </div>
            <a className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 py-2"
              href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("היי, רוצה להוסיף דירה לאתר")}`}
              target="_blank" rel="noreferrer">
              <Phone className="w-4 h-4" /> וואטסאפ
            </a>
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-white/50 text-sm">{site.footerText}</footer>
      <Gallery apt={openGallery} onClose={()=>setOpenGallery(null)} />
      {openEdit && admin && <EditAptModal apt={openEdit} onClose={()=>setOpenEdit(null)} onSave={saveApartments} />}
      {openSiteEdit && admin && <EditSiteModal site={site} onClose={()=>setOpenSiteEdit(false)} onSave={saveSite} />}
      {showLogin && <AdminLoginModal onClose={()=>setShowLogin(false)} onOk={onAdminOk} />}
    </div>
  );
}
