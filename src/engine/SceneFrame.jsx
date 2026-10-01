import { useEffect, useRef, useState } from "react";

/* ============================================================
   MOTEUR — SceneFrame
   ------------------------------------------------------------
   Rend ses enfants dans un cadre au ratio donné (par défaut
   1000/560, celui des scènes du jeu 1), calé sur le PLUS GRAND
   cadre qui rentre dans la cellule parente. Sert à toutes les
   scènes hors-chapitre (intro, jeu 3, mini-jeux plein écran)
   pour qu'elles occupent la même surface visible à l'écran,
   comme les scènes du voyage principal.

   Usage :
     <SceneFrame>
       <svg viewBox="0 0 1200 680" style={{ width: '100%', height: '100%' }}>
         …
       </svg>
     </SceneFrame>

   Props :
     ratio  — ratio du cadre (largeur / hauteur). Défaut 1000/560.
     style  — style additionnel du wrapper externe.
   ============================================================ */
export default function SceneFrame({ ratio = 1000 / 560, style, children }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const b = w / h > ratio
        ? { w: Math.round(h * ratio), h }
        : { w, h: Math.round(w / ratio) };
      setBox(b);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio]);

  return (
    <div ref={ref}
      style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
        ...(style || {}) }}>
      {box && (
        <div style={{ width: box.w, height: box.h, position: "relative", overflowY: "auto", overflowX: "hidden", scrollbarGutter: "stable" }}>
          {children}
        </div>
      )}
    </div>
  );
}
