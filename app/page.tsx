"use client";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Check, Plus } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Perfume = dynamic(() => import("@/components/Perfume"), { ssr: false });
const launch = new Date("2026-12-20T00:00:00+01:00").getTime();
const orbit = JSON.stringify({
  v: "5.7.4", fr: 30, ip: 0, op: 90, w: 100, h: 100, nm: "Orbit",
  layers: [{ ty: 4, ip: 0, op: 90, st: 0, ks: {
    o: { a: 0, k: 100 }, r: { a: 1, k: [{ t: 0, s: [0], e: [360], o: { x: .33, y: .33 }, i: { x: .67, y: .67 } }, { t: 90, s: [360] }] },
    p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }
  }, shapes: [{ ty: "el", p: { a: 0, k: [0, -25] }, s: { a: 0, k: [5, 5] } }, { ty: "fl", c: { a: 0, k: [.96, .89, .8, 1] }, o: { a: 0, k: 100 } }] }]
});
function countdown() {
  const delta = Math.max(0, launch - Date.now());
  return [Math.floor(delta / 86400000), Math.floor(delta / 3600000) % 24, Math.floor(delta / 60000) % 60];
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [minimum, setMinimum] = useState(false);
  const [failed, setFailed] = useState(false);
  const [remaining, setRemaining] = useState<number[] | null>(null);
  const [saved, setSaved] = useState(false);
  const [legal, setLegal] = useState(false);
  const loading = !minimum || (!ready && !failed);
  const { scrollYProgress } = useScroll();
  const titleY = useTransform(scrollYProgress, [0, .4], [0, -100]);
  const titleOpacity = useTransform(scrollYProgress, [0, .28], [1, 0]);
  const onProgress = useCallback((n: number) => setProgress(n), []);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setFailed(true); setProgress(100); }, []);
  useEffect(() => {
    const timer = setTimeout(() => setMinimum(true), 2000);
    setRemaining(countdown()); const interval = setInterval(() => setRemaining(countdown()), 1000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [loading]);
  useEffect(() => {
    if (!legal) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setLegal(false); };
    window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close);
  }, [legal]);
  function saveDate() {
    const file = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//INCARNAT//Launch//FR", "BEGIN:VEVENT",
      "UID:incarnat-launch-20261220", "DTSTAMP:20261020T080000Z", "DTSTART;VALUE=DATE:20261220", "DTEND;VALUE=DATE:20261221",
      "SUMMARY:INCARNAT — La révélation", "DESCRIPTION:Découvrir le nouveau parfum INCARNAT.", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([file], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "incarnat-20-decembre.ics"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setSaved(true);
  }
  return (
    <>
      <div className="backdrop" aria-hidden="true"><div className="halo" /><div className="grain" /></div>
      <Perfume onProgress={onProgress} onReady={onReady} onError={onError} />
      {failed && <div className="model-fallback" role="status"><div className="fallback-cap" /><div className="fallback-bottle"><span>INCARNAT</span><small>LE PARFUM</small></div><p>Vue 3D indisponible sur ce navigateur</p></div>}
      <AnimatePresence>
        {loading && <motion.div className="preloader" key="loader" exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 1, ease: [.76, 0, .24, 1] }}>
          <span className="eyebrow">Une nouvelle présence</span>
          <div className="loader-center"><DotLottieReact data={orbit} loop autoplay className="lottie-orbit" /><span className="loader-symbol">i.</span></div>
          <div className="loader-bottom"><span>INCARNAT</span><span>{Math.round(progress).toString().padStart(3, "0")}%</span></div>
          <div className="loader-track"><motion.div animate={{ width: `${progress}%` }} /></div>
        </motion.div>}
      </AnimatePresence>
      <header className="site-header">
        <a className="wordmark" href="#accueil" aria-label="Incarnat, accueil">incarnat<span>®</span></a>
        <a className="header-link" href="#rendez-vous">La révélation <ArrowUpRight size={14} /></a>
      </header>
      <main>
        <section id="accueil" className="hero">
          <motion.div className="hero-heading" style={{ y: titleY, opacity: titleOpacity }}>
            <div className="hero-kicker eyebrow"><span>Une nouvelle expression du parfum</span><span>Édition 01 — 2026</span></div>
            <h1>INCARNAT</h1>
          </motion.div>
          <div className="hero-aside"><span className="tiny-cross">✳</span><p>Ne se raconte pas.<br />Se ressent.</p></div>
          <div className="hero-foot">
            <div className="hero-copy"><span className="eyebrow">Bientôt, à même la peau.</span><h2>L’intensité.<br /><em>À fleur de peau.</em></h2></div>
            <a href="#presence" className="scroll-link"><span className="circle"><ArrowDown size={18} strokeWidth={1.2} /></span><span>Faites défiler<br /><b>Éveillez les sens</b></span></a>
            <div className="launch-stamp"><span className="eyebrow">La révélation</span><strong>20.12.26</strong><span>Deux mois avant l’émotion.</span></div>
          </div>
        </section>
        <section id="presence" className="presence">
          <div className="section-top eyebrow"><span>01 / La présence</span><span>Le sillage d’une rencontre</span></div>
          <motion.div className="presence-copy" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .8 }}>
            <span className="eyebrow">L’invisible devient inoubliable.</span>
            <h2>Un souffle.<br />Un trouble.<br /><em>Une présence.</em></h2>
            <p>Il y a des rencontres qui restent.<br />Des silences qui disent tout.<br />Et un parfum qui ne vous quitte plus.</p>
            <div className="fine-rule" /><span className="eyebrow">Le reste se dévoile le 20 décembre.</span>
          </motion.div>
          <span className="vertical-note eyebrow">Tournez autour de l’émotion — 360°</span>
          <span className="section-numeral" aria-hidden="true">01</span>
        </section>
        <section id="rendez-vous" className="reveal">
          <div className="section-top eyebrow"><span>02 / Le rendez-vous</span><span>20 décembre 2026</span></div>
          <div className="reveal-title"><span className="eyebrow">L’attente fait partie du désir.</span><h2>À très <em>bientôt.</em></h2></div>
          <div className="reveal-bottom">
            <div><span className="eyebrow">Le premier jour d’une nouvelle histoire.</span><div className="countdown" aria-label="Compte à rebours avant la sortie">{["Jours", "Heures", "Minutes"].map((label, i) => <div key={label}><strong>{remaining ? String(remaining[i]).padStart(2, "0") : "—"}</strong><span>{label}</span></div>)}</div></div>
            <div className="calendar-block"><button className="calendar-button" onClick={saveDate}><span>{saved ? "Rendez-vous enregistré" : "Gardez la date"}</span>{saved ? <Check size={20} /> : <ArrowUpRight size={22} />}</button><span aria-live="polite">{saved ? "Ouvrez le fichier .ics dans votre calendrier." : "Le 20 décembre 2026, tout commence."}</span></div>
          </div>
          <footer><a href="#accueil" className="footer-logo">incarnat®</a><span>Un parfum. Une empreinte.</span><button onClick={() => setLegal(true)}>À propos <Plus size={12} /></button><span>© INCARNAT 2026</span></footer>
        </section>
      </main>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      <AnimatePresence>{legal && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLegal(false)}><div className="about-dialog" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={e => e.stopPropagation()}><span className="eyebrow">À propos</span><h2 id="about-title">Une présence,<br /><em>imaginée pour vous.</em></h2><p>INCARNAT est une proposition de direction artistique pour le lancement d’un parfum. Le nom et les textes sont créatifs. Date de lancement retenue : 20 décembre 2026.</p><p>Ce site ne collecte aucune adresse e-mail. Le bouton « Gardez la date » télécharge un événement pour votre calendrier.</p><button autoFocus className="calendar-button" onClick={() => setLegal(false)}>Fermer <Plus className="rotate-45" size={20} /></button></div></motion.div>}</AnimatePresence>
    </>
  );
}
