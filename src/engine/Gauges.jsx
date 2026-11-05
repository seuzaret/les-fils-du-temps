/* ============================================================
   MOTEUR — Les 4 jauges d'un message (préparé au jalon M1,
   alimenté en données au jalon M2)
   Affiche : 🏃 Vitesse · 🌍 Portée · 📦 Capacité · ⏳ Durabilité
   `values` : { vitesse: 1, portee: 1, capacite: 3, durabilite: 5 }
   (valeurs sur 5). Si aucune valeur : n'affiche rien — les
   fiches actuelles n'en ont pas encore.
   ============================================================ */

const GAUGES = [
  { id: "vitesse", label: "Vitesse", emoji: "🏃", color: "#5eb2ff" },
  { id: "portee", label: "Portée", emoji: "🌍", color: "#5eff9e" },
  { id: "capacite", label: "Capacité", emoji: "📦", color: "#ffd166" },
  { id: "durabilite", label: "Durabilité", emoji: "⏳", color: "#e8934a" },
];

export default function Gauges({ values }) {
  if (!values) return null;
  return (
    <div style={{ marginTop: 14, display: "grid", gap: 7 }}>
      {GAUGES.map((g, i) => (
        <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{g.emoji}</span>
          <span style={{ fontSize: 12, color: "#8fa3bd", width: 68, fontFamily: "ui-monospace,monospace" }}>{g.label}</span>
          <div style={{ flex: 1, height: 10, background: "#141b26", borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${(values[g.id] ?? 0) * 20}%`,
              background: g.color, borderRadius: 6,
              animation: `gaugeFill .8s ease-out ${0.15 * i}s backwards`,
            }} />
          </div>
          <span style={{ fontSize: 12, color: "#8fa3bd", width: 26, textAlign: "right", fontFamily: "ui-monospace,monospace" }}>{values[g.id] ?? 0}/5</span>
        </div>
      ))}
    </div>
  );
}
