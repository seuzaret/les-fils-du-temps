import { useState } from "react";
import Gauges from "./Gauges.jsx";

/* ============================================================
   MOTEUR — La frise des supports (le fil rouge pédagogique)
   ============================================================
   Une ligne de temps : chaque message découvert y devient un
   point (cristal vert = transmis, fragment gris 💨 = perdu).
   Toucher un point affiche ses 4 mini-jauges. La frise est
   CUMULATIVE : elle se remplit au fil des chapitres — chaque
   entrée de `collection` garde son époque et ses valeurs :
   { id, titre, emoji, date, jauges, perdu }

   trendSentence() fabrique la phrase de MARTINE sur la
   tendance, CALCULÉE à partir des valeurs réelles :
   - plusieurs époques → comparaison début/fin du voyage
     (la performance monte, la durabilité chute) ;
   - une seule époque → le paradoxe interne (ce qui dure ne
     voyage pas, ce qui voyage ne dure pas).
   ============================================================ */

const avg = (arr, k) => arr.reduce((s, c) => s + (c.jauges?.[k] ?? 0), 0) / arr.length;
const perf = (arr) => (avg(arr, "vitesse") + avg(arr, "portee") + avg(arr, "capacite")) / 3;

export function trendSentence(collection) {
  const c = collection.filter((m) => m.jauges);
  if (c.length < 2) return null;
  const dates = [...new Set(c.map((m) => m.date))];

  /* plusieurs époques : la tendance historique, chiffrée */
  if (dates.length >= 2) {
    const debut = c.filter((m) => m.date === dates[0]);
    const fin = c.filter((m) => m.date === dates[dates.length - 1]);
    const p1 = perf(debut).toFixed(1), p2 = perf(fin).toFixed(1);
    const d1 = avg(debut, "durabilite").toFixed(1), d2 = avg(fin, "durabilite").toFixed(1);
    return `De ${dates[0]} à ${dates[dates.length - 1]}, la performance moyenne de tes messages (vitesse, portée, capacité) est passée de ${p1}/5 à ${p2}/5… pendant que leur durabilité ${+d2 < +d1 ? "chutait" : "passait"} de ${d1}/5 à ${d2}/5. Plus un support est puissant, moins il dure. Intéressant, non ?`;
  }

  /* une seule époque : le paradoxe interne du chapitre */
  const maxD = c.reduce((a, b) => ((b.jauges.durabilite ?? 0) > (a.jauges.durabilite ?? 0) ? b : a));
  const maxV = c.reduce((a, b) => ((b.jauges.vitesse ?? 0) > (a.jauges.vitesse ?? 0) ? b : a));
  if (maxD.id === maxV.id) return null;
  return `Regarde ta collection : « ${maxD.titre} » (durabilité ${maxD.jauges.durabilite}/5) traversera les millénaires mais ne voyage pas, tandis que « ${maxV.titre} » (vitesse ${maxV.jauges.vitesse}/5) court loin mais ne laissera aucune trace. Ce qui dure ne voyage pas ; ce qui voyage ne dure pas… pour l'instant.`;
}

export default function Frise({ collection }) {
  const [sel, setSel] = useState(null);
  if (!collection.length) return null;
  const selected = collection.find((c) => c.id === sel);

  /* étiquettes d'époque : une par groupe de dates consécutives */
  const labels = [];
  let start = 0;
  for (let i = 1; i <= collection.length; i++) {
    if (i === collection.length || collection[i].date !== collection[start].date) {
      labels.push({ date: collection[start].date, x: (((start + i) / 2) / collection.length) * 100 });
      start = i;
    }
  }

  return (
    <div style={{ margin: "12px 0" }}>
      <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11.5, letterSpacing: 2, color: "#8fa3bd", marginBottom: 6 }}>
        ⏳ FRISE DES SUPPORTS — touche un point pour voir ses jauges
      </div>
      <div style={{ position: "relative", height: 62 }}>
        {/* la ligne de temps */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 26, height: 2, background: "linear-gradient(90deg,#2a3648,#5eff9e66,#2a3648)" }} />
        {/* un point par message découvert */}
        {collection.map((c, i) => {
          const isSel = sel === c.id;
          return (
            <button key={c.id}
              onClick={() => setSel(isSel ? null : c.id)}
              onMouseEnter={() => setSel(c.id)}
              title={c.titre}
              style={{
                position: "absolute", left: `${((i + 0.5) / collection.length) * 100}%`, top: 26,
                transform: "translate(-50%,-50%)", width: 34, height: 34, borderRadius: "50%",
                cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0,
                background: c.perdu ? "#1c2230" : "#12281c",
                border: `2px solid ${isSel ? "#ffd166" : c.perdu ? "#5a6678" : "#5eff9e"}`,
                boxShadow: isSel ? "0 0 10px rgba(255,209,102,0.5)" : "none",
                opacity: c.perdu ? 0.75 : 1,
              }}>
              {c.perdu ? "💨" : c.emoji}
            </button>
          );
        })}
        {/* les époques sous la ligne */}
        {labels.map((l) => (
          <span key={l.date + l.x} style={{ position: "absolute", left: `${l.x}%`, top: 48, transform: "translateX(-50%)", fontFamily: "ui-monospace,monospace", fontSize: 11.5, color: "#e8934a", whiteSpace: "nowrap" }}>
            {l.date}
          </span>
        ))}
      </div>
      {/* le détail du point touché : titre + les 4 mini-jauges */}
      {selected && (
        <div style={{ background: "#141b26", border: "1px solid #2a3648", borderRadius: 10, padding: "8px 12px 12px", marginTop: 4 }}>
          <strong style={{ fontSize: 14.5 }}>
            {selected.perdu ? "💨" : selected.emoji} {selected.titre}
            <span style={{ color: "#8fa3bd", fontWeight: 400 }}> · {selected.date}</span>
            {selected.perdu && <span style={{ color: "#7a879e", fontWeight: 400 }}> · perdu en route</span>}
          </strong>
          <Gauges values={selected.jauges} />
        </div>
      )}
    </div>
  );
}
