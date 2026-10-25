import { useEffect, useState } from "react";

/* ============================================================
   MOTEUR — useEcran : la forme de l'écran, pour les téléphones
   ------------------------------------------------------------
   etroit   — moins de 760 px de large (téléphone en portrait,
              petite tablette) : on replie ce qui prend de la
              place sur les côtés (mini-carte du Jeu 3…).
   bas      — moins de 520 px de haut (téléphone en paysage) :
              on compacte les bandeaux pour laisser la hauteur
              au décor.
   portrait — plus haut que large.
   Recalculé au redimensionnement et à la rotation.
   ============================================================ */
const mesure = () => {
  if (typeof window === "undefined") return { etroit: false, bas: false, portrait: false };
  const w = window.innerWidth, h = window.innerHeight;
  return { etroit: w < 760, bas: h < 520, portrait: h > w };
};

export default function useEcran() {
  const [e, setE] = useState(mesure);
  useEffect(() => {
    const sync = () => setE((old) => {
      const n = mesure();
      return n.etroit === old.etroit && n.bas === old.bas && n.portrait === old.portrait ? old : n;
    });
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => { window.removeEventListener("resize", sync); window.removeEventListener("orientationchange", sync); };
  }, []);
  return e;
}
