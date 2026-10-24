/* ============================================================
   LE MONDE 2 — vignettes des tableaux (pour l'animation finale)
   ------------------------------------------------------------
   Chaque tableau du Jeu 1 est un seul <svg> autonome. On le rend en
   texte (renderToStaticMarkup, sans le monter dans la page), on retire
   ses animations (<animate…>, sinon l'image se redessinerait sans
   cesse), et on en fait une image SVG figée, dessinée une fois dans un
   <canvas>. L'animation déplace ensuite 46 petites images fixes au lieu
   de 46 tableaux vivants : fluide, même sur un vieil ordinateur.
   ============================================================ */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EPOQUES } from "./epoquesMonde2.js";

const noop = () => {};
const PROPS = { collect: noop, action: noop, reveal: false, made: [], flags: {}, queteQui: null, mode: "jeu2" };

/** Le tableau en adresse « data: » d'image SVG figée. */
export function urlDuTableau(Composant) {
  let svg = renderToStaticMarkup(createElement(Composant, PROPS));
  svg = svg.replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*?(\/>|>[\s\S]*?<\/\1>)/g, "");
  svg = svg.replace(/^<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="560"');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Dessine le tableau dans `canvas` (taille du canvas). Renvoie une promesse. */
export function dessinerTableau(Composant, canvas) {
  return new Promise((ok) => {
    let url;
    try { url = urlDuTableau(Composant); } catch { ok(false); return; }
    const img = new Image();
    img.onload = () => {
      try {
        const c = canvas.getContext("2d");
        c.drawImage(img, 0, 0, canvas.width, canvas.height);
        ok(true);
      } catch { ok(false); }
    };
    img.onerror = () => ok(false);
    img.src = url;
  });
}

/* ───────────── les 46 vignettes, dessinées une fois ─────────────
   preparerVignettes() les dessine une par une (une toutes les ~30 ms,
   pour ne pas figer la page) dans l'ordre des époques ; on l'appelle
   dès que le monde est presque rangé, pour qu'elles soient prêtes à la
   finale. vignettesPretes()[i] : le canvas de la vignette i, ou null. */
const LISTE = EPOQUES.flatMap((ep) => ep.tableaux.map((s) => s.Component));
const pretes = Array(LISTE.length).fill(null);
const abonnes = new Set();
let lancee = false;

export function vignettesPretes() { return pretes; }
export function abonnerVignettes(f) { abonnes.add(f); return () => abonnes.delete(f); }

export function preparerVignettes() {
  if (lancee) return;
  lancee = true;
  let i = 0;
  const suivante = () => {
    if (i >= LISTE.length) return;
    const k = i++;
    const c = document.createElement("canvas");
    c.width = 300; c.height = 168;
    dessinerTableau(LISTE[k], c).then((ok) => {
      if (ok) { pretes[k] = c; abonnes.forEach((f) => f()); }
      setTimeout(suivante, 30);
    });
  };
  suivante();
}
