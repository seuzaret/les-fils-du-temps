/* ============================================================
   MOTEUR — un tableau du Jeu 1 en image fixe
   ------------------------------------------------------------
   Chaque tableau est un seul <svg> autonome. On le rend en texte
   (renderToStaticMarkup, sans le monter dans la page), on retire ses
   animations (<animate…>, sinon l'image se redessinerait sans cesse),
   et on en fait une image SVG figée (« data: »). Sert à la finale du
   monde 2 (martine/vignettes.js) et à l'écran titre « la pellicule ».
   ============================================================ */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const noop = () => {};
const PROPS = { collect: noop, action: noop, reveal: false, made: [], flags: {}, queteQui: null, mode: "jeu2" };

/** Le tableau en adresse « data: » d'image SVG figée. */
export function urlDuTableau(Composant) {
  let svg = renderToStaticMarkup(createElement(Composant, PROPS));
  svg = svg.replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*?(\/>|>[\s\S]*?<\/\1>)/g, "");
  svg = svg.replace(/^<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="560"');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
