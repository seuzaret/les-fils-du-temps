import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 5 — Tableau adjacent : LE CHANTIER DE LA CATHÉDRALE
   ------------------------------------------------------------
   L'intérieur en construction d'une cathédrale gothique :
   voûte d'ogives, colonnes élancées, échafaudages en bois,
   grande rose polychrome, un maître verrier au travail devant
   un vitrail, un sculpteur qui grave un chapiteau, tympan
   sculpté au fond (la "BD" médiévale).
   ============================================================ */

export default function SceneCathedrale({ collect, action, reveal, inv = [] }) {
  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ca-mur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8b898" /><stop offset="100%" stopColor="#8a7860" /></linearGradient>
        <linearGradient id="ca-sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a89880" /><stop offset="100%" stopColor="#5a4838" /></linearGradient>
        <radialGradient id="ca-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f8e0a0" stopOpacity="0.75" /><stop offset="100%" stopColor="#f8e0a0" stopOpacity="0" /></radialGradient>
        <linearGradient id="ca-vit-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e84028" /><stop offset="100%" stopColor="#8a2018" /></linearGradient>
        <linearGradient id="ca-vit-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a80c8" /><stop offset="100%" stopColor="#1a4088" /></linearGradient>
        <linearGradient id="ca-vit-j" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8d848" /><stop offset="100%" stopColor="#c89830" /></linearGradient>
      </defs>

      <PLayer depth={1}>
        {/* Mur du fond avec grain de pierre */}
        <rect width="1000" height="440" fill="url(#ca-mur)" />
        {/* joints de pierre horizontaux subtils (assises regulieres) */}
        {[80, 140, 200, 260, 320, 380].map((y, i) => (
          <path key={`h${i}`} d={`M0 ${y} h1000`} stroke="#5a4838" strokeWidth="0.6" opacity="0.3" />
        ))}
        {/* joints verticaux decales par assise (appareil regulier) */}
        {[80, 140, 200, 260, 320, 380].map((y, r) => (
          <g key={`v${r}`}>
            {[100, 250, 400, 600, 750, 900].map((x, i) => (
              <path key={i} d={`M${x + (r % 2 === 0 ? 0 : 75)} ${y} v60`} stroke="#5a4838" strokeWidth="0.5" opacity="0.28" />
            ))}
          </g>
        ))}
        {/* voûte d'ogives : arceaux qui montent, plus visibles */}
        <path d="M0 60 Q250 -40 500 60 M500 60 Q750 -40 1000 60" stroke="#5a4838" strokeWidth="4" fill="none" />
        <path d="M100 100 Q250 20 400 100 M600 100 Q750 20 900 100" stroke="#5a4838" strokeWidth="2.4" fill="none" opacity="0.7" />
        {/* nervures secondaires */}
        <path d="M0 80 Q250 -10 500 80 M500 80 Q750 -10 1000 80" stroke="#7a6848" strokeWidth="1.2" fill="none" opacity="0.5" />
        {/* clé de voûte centrale, ornee */}
        <circle cx="500" cy="60" r="14" fill="#8a7860" stroke="#3a2818" strokeWidth="1.2" />
        <circle cx="500" cy="60" r="8" fill="#a89680" stroke="#3a2818" strokeWidth="0.5" />
        <path d="M494 60 h12 M500 54 v12" stroke="#3a2818" strokeWidth="1" />
        {/* colonnes latérales élancées + cannelures */}
        <rect x="60" y="100" width="20" height="340" fill="url(#ca-mur)" stroke="#5a4838" strokeWidth="0.8" />
        <path d="M66 108 v320 M74 108 v320" stroke="#5a4838" strokeWidth="0.6" opacity="0.55" />
        <rect x="920" y="100" width="20" height="340" fill="url(#ca-mur)" stroke="#5a4838" strokeWidth="0.8" />
        <path d="M926 108 v320 M934 108 v320" stroke="#5a4838" strokeWidth="0.6" opacity="0.55" />
        {/* chapiteaux ornés (bases + haut) */}
        <rect x="56" y="94" width="28" height="10" fill="#8a7860" stroke="#3a2818" strokeWidth="0.6" />
        <rect x="52" y="102" width="36" height="4" fill="#a89680" />
        <rect x="916" y="94" width="28" height="10" fill="#8a7860" stroke="#3a2818" strokeWidth="0.6" />
        <rect x="912" y="102" width="36" height="4" fill="#a89680" />
        {/* bases des colonnes au sol */}
        <rect x="50" y="440" width="40" height="12" fill="#a89680" stroke="#3a2818" strokeWidth="0.6" />
        <rect x="910" y="440" width="40" height="12" fill="#a89680" stroke="#3a2818" strokeWidth="0.6" />
        {/* deux colonnes SECONDAIRES a mi-distance pour donner du rythme */}
        <rect x="270" y="120" width="14" height="320" fill="url(#ca-mur)" stroke="#5a4838" strokeWidth="0.6" opacity="0.9" />
        <rect x="716" y="120" width="14" height="320" fill="url(#ca-mur)" stroke="#5a4838" strokeWidth="0.6" opacity="0.9" />
        <rect x="266" y="114" width="22" height="8" fill="#8a7860" stroke="#3a2818" strokeWidth="0.5" />
        <rect x="712" y="114" width="22" height="8" fill="#8a7860" stroke="#3a2818" strokeWidth="0.5" />
        {/* halo lumineux qui vient de la grande rose */}
        <circle cx="500" cy="260" r="180" fill="url(#ca-halo)" />
        {/* rayons colorés obliques (soleil qui traverse le vitrail) */}
        <path d="M200 340 L340 560 L360 560 L220 340 Z" fill="url(#ca-vit-r)" opacity="0.2" />
        <path d="M800 340 L660 560 L640 560 L780 340 Z" fill="url(#ca-vit-b)" opacity="0.2" />
        <path d="M500 240 L440 560 L470 560 L500 240 Z" fill="url(#ca-vit-j)" opacity="0.18" />
        {/* poussière qui danse dans les rais de lumière */}
        {[[300, 400, 2.4], [340, 460, 3], [700, 420, 2.8], [660, 480, 2.2], [500, 380, 3.4], [480, 460, 2.6]].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r="1" fill="#f8e0a0" opacity="0.65" style={{ animation: `float ${d}s ease-in-out infinite` }} />
        ))}
      </PLayer>

      <PLayer depth={1.5}>
        {/* GRANDE ROSE polychrome au centre */}
        <g transform="translate(500,240)">
          {/* cadre externe */}
          <circle r="90" fill="#3a2818" stroke="#2a1810" strokeWidth="2" />
          <circle r="86" fill="#5a4838" />
          {/* pétales en croix, alternance de couleurs */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const cx = Math.cos(rad) * 46;
            const cy = Math.sin(rad) * 46;
            const fill = i % 3 === 0 ? "url(#ca-vit-r)" : i % 3 === 1 ? "url(#ca-vit-b)" : "url(#ca-vit-j)";
            return <ellipse key={i} cx={cx} cy={cy} rx="18" ry="10" fill={fill} stroke="#2a1810" strokeWidth="0.8" transform={`rotate(${a} ${cx} ${cy})`} />;
          })}
          {/* centre de la rose */}
          <circle r="22" fill="url(#ca-vit-b)" stroke="#2a1810" strokeWidth="1" />
          <path d="M-14 0 L14 0 M0 -14 L0 14 M-10 -10 L10 10 M10 -10 L-10 10" stroke="#f8d848" strokeWidth="2" />
          <circle r="6" fill="url(#ca-vit-r)" stroke="#2a1810" strokeWidth="0.6" />
          {/* meneaux : nervures en pierre */}
          <path d="M-86 0 L86 0 M0 -86 L0 86 M-60 -60 L60 60 M60 -60 L-60 60" stroke="#8a7860" strokeWidth="2.5" />
          <circle r="90" fill="none" stroke="#3a2818" strokeWidth="4" />
        </g>
        {/* VITRAIL latéral gauche (long, ogive) */}
        <g transform="translate(200,340)">
          <path d="M-30 100 L-30 -80 Q-30 -110 0 -110 Q30 -110 30 -80 L30 100 Z" fill="#3a2818" stroke="#2a1810" strokeWidth="1.5" />
          {/* panneaux colorés */}
          <rect x="-24" y="-74" width="48" height="26" fill="url(#ca-vit-r)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="-46" width="48" height="26" fill="url(#ca-vit-b)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="-18" width="48" height="26" fill="url(#ca-vit-j)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="10" width="48" height="26" fill="url(#ca-vit-b)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="38" width="48" height="26" fill="url(#ca-vit-r)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="66" width="48" height="30" fill="url(#ca-vit-j)" stroke="#5a4838" strokeWidth="0.6" />
          {/* petits personnages stylisés dans chaque panneau */}
          <circle cx="0" cy="-60" r="5" fill="#f0e8d0" />
          <path d="M-4 -55 L4 -55 L2 -45 L-2 -45 Z" fill="#f0e8d0" />
          <circle cx="0" cy="-32" r="5" fill="#f0e8d0" />
          <path d="M-4 -27 L4 -27 L2 -17 L-2 -17 Z" fill="#f0e8d0" />
          {/* plomb : lignes qui séparent */}
          <path d="M-24 -74 L24 -74 M-24 -48 L24 -48 M-24 -20 L24 -20 M-24 8 L24 8 M-24 36 L24 36 M-24 64 L24 64" stroke="#1a1408" strokeWidth="1.5" />
          <path d="M0 -110 L0 96" stroke="#1a1408" strokeWidth="1.5" />
        </g>
        {/* VITRAIL latéral droit (miroir) */}
        <g transform="translate(800,340)">
          <path d="M-30 100 L-30 -80 Q-30 -110 0 -110 Q30 -110 30 -80 L30 100 Z" fill="#3a2818" stroke="#2a1810" strokeWidth="1.5" />
          <rect x="-24" y="-74" width="48" height="26" fill="url(#ca-vit-b)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="-46" width="48" height="26" fill="url(#ca-vit-j)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="-18" width="48" height="26" fill="url(#ca-vit-r)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="10" width="48" height="26" fill="url(#ca-vit-j)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="38" width="48" height="26" fill="url(#ca-vit-b)" stroke="#5a4838" strokeWidth="0.6" />
          <rect x="-24" y="66" width="48" height="30" fill="url(#ca-vit-r)" stroke="#5a4838" strokeWidth="0.6" />
          <circle cx="0" cy="-60" r="5" fill="#f0e8d0" />
          <path d="M-4 -55 L4 -55 L2 -45 L-2 -45 Z" fill="#f0e8d0" />
          <path d="M-24 -74 L24 -74 M-24 -48 L24 -48 M-24 -20 L24 -20 M-24 8 L24 8 M-24 36 L24 36 M-24 64 L24 64" stroke="#1a1408" strokeWidth="1.5" />
          <path d="M0 -110 L0 96" stroke="#1a1408" strokeWidth="1.5" />
        </g>
      </PLayer>

      <PLayer depth={2}>
        {/* ÉCHAFAUDAGE en bois à gauche (le chantier n'est pas fini) */}
        <g transform="translate(120,440)">
          <path d="M0 0 L0 -280 M30 0 L30 -280" stroke="#5a3818" strokeWidth="3" />
          <path d="M0 -60 L30 -60 M0 -120 L30 -120 M0 -180 L30 -180 M0 -240 L30 -240" stroke="#8a5a2e" strokeWidth="2" />
          <path d="M-4 -62 L34 -62 L34 -56 L-4 -56 Z" fill="#8a5a2e" stroke="#3a1810" strokeWidth="0.6" />
          <path d="M-4 -122 L34 -122 L34 -116 L-4 -116 Z" fill="#8a5a2e" stroke="#3a1810" strokeWidth="0.6" />
          <path d="M0 -30 L30 -50 M0 -90 L30 -110 M0 -150 L30 -170" stroke="#5a3818" strokeWidth="1.5" />
          {/* seau de mortier suspendu */}
          <path d="M15 -180 L15 -200" stroke="#3a2010" strokeWidth="0.6" />
          <path d="M8 -180 Q8 -168 15 -166 L22 -166 Q30 -168 30 -180 Z" fill="#5a4838" stroke="#2a1810" strokeWidth="0.4" />
        </g>
        {/* TYMPAN SCULPTÉ au fond, au-dessus de l'entrée */}
        <g transform="translate(500,410)">
          {/* arc ogival */}
          <path d="M-70 0 Q-70 -50 0 -70 Q70 -50 70 0 Z" fill="#c8b898" stroke="#3a2818" strokeWidth="1" />
          {/* Christ en gloire */}
          <ellipse cx="0" cy="-42" rx="12" ry="10" fill="#a08868" stroke="#3a2818" strokeWidth="0.6" />
          <circle cx="0" cy="-42" r="14" fill="none" stroke="#c8a848" strokeWidth="1" />
          <path d="M-8 -30 L-16 -20 L-14 -8 L14 -8 L16 -20 L8 -30 Z" fill="#a08868" stroke="#3a2818" strokeWidth="0.6" />
          {/* petits personnages autour (apôtres) */}
          {[[-40, -20], [-30, -8], [30, -8], [40, -20]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x},${y})`}>
              <circle r="4" fill="#a08868" stroke="#3a2818" strokeWidth="0.4" />
              <path d="M-3 3 L-3 12 L3 12 L3 3 Z" fill="#a08868" stroke="#3a2818" strokeWidth="0.4" />
            </g>
          ))}
        </g>
      </PLayer>

      <PLayer depth={2.5}>
        {/* sol dalles noires et blanches — plus riche : damier en
            perspective (tuiles qui retrecissent vers le fond), tache de
            lumiere coloree qui tombe de la rose, tapis central rouge. */}
        <rect y="440" width="1000" height="120" fill="url(#ca-sol)" />
        {/* damier en perspective (rangees vues du dessus, plus etroites
            au fond) : chaque rangee change de hauteur. */}
        {[
          { y: 440, h: 22, tiles: 14, off: 0 },
          { y: 462, h: 30, tiles: 12, off: 1 },
          { y: 492, h: 34, tiles: 11, off: 0 },
          { y: 526, h: 34, tiles: 10, off: 1 },
        ].map((row, ri) => (
          <g key={ri}>
            {Array.from({ length: row.tiles }).map((_, c) => {
              const w = 1000 / row.tiles;
              return (c + ri + row.off) % 2 === 0 ? (
                <rect key={c} x={c * w} y={row.y} width={w} height={row.h}
                  fill="#3a2818" opacity={0.65 - ri * 0.05} />
              ) : null;
            })}
            {/* joint entre rangees */}
            <path d={`M0 ${row.y} h1000`} stroke="#241408" strokeWidth="0.6" opacity="0.4" />
          </g>
        ))}
        {/* TAPIS ROUGE central (chemin de l'autel) — trapeze en
            perspective, plus etroit au fond. */}
        <path d="M480 440 L520 440 L560 560 L440 560 Z" fill="#7a2044" opacity="0.85" />
        <path d="M480 440 L520 440 L560 560 L440 560 Z" fill="#3a0a20" opacity="0.25" filter="url(#ca-vit-r)" />
        {/* franges du tapis */}
        <path d="M440 560 L560 560" stroke="#c8a848" strokeWidth="2" />
        {/* motifs geometriques dores discrets sur le tapis */}
        <path d="M488 470 h24 M486 490 h28 M482 512 h36 M478 536 h44" stroke="#c8a848" strokeWidth="0.8" opacity="0.7" />
        {/* GRANDE TACHE DE LUMIERE COLOREE au sol (soleil qui traverse la
            rose) — halo circulaire teinte de rouge et bleu. */}
        <ellipse cx="500" cy="490" rx="220" ry="30" fill="#f8e0a0" opacity="0.28" />
        <ellipse cx="500" cy="486" rx="60" ry="14" fill="#e84028" opacity="0.18" />
        <ellipse cx="430" cy="500" rx="40" ry="10" fill="#3a80c8" opacity="0.15" />
        <ellipse cx="580" cy="502" rx="40" ry="10" fill="#f8d848" opacity="0.15" />
        {/* GARGOUILLE de pierre penchée depuis le haut à gauche */}
        <g transform="translate(90,340)">
          <path d="M0 0 Q-8 -12 -16 -6 L-14 6 L-4 8 Z" fill="#8a7860" stroke="#3a2818" strokeWidth="0.6" />
          <circle cx="-8" cy="-2" r="1.4" fill="#0a0806" />
          <circle cx="-2" cy="-2" r="1.4" fill="#0a0806" />
          {/* langue sortie */}
          <path d="M-6 4 L-6 10 L-4 10 L-4 4 Z" fill="#8a2818" />
          {/* dents */}
          <path d="M-8 4 l0 2 M-4 4 l0 2" stroke="#f0e8d0" strokeWidth="0.5" />
        </g>
        {/* petites bougies allumées sur candelabres */}
        {[[440, 500], [560, 500]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-2" y="0" width="4" height="20" fill="#e8dcc0" />
            <path d="M0 0 l0 -6" stroke="#8a7048" strokeWidth="0.6" />
            <ellipse cx="0" cy="-8" rx="1.4" ry="3" fill="#f8c058" style={{ animation: "float 1.2s ease-in-out infinite" }} />
            <ellipse cx="0" cy="-8" rx="0.8" ry="1.8" fill="#fff4c8" />
          </g>
        ))}
        {/* prie-Dieu à droite */}
        <g transform="translate(880,500)">
          <path d="M-14 20 L14 20 L18 -8 L-10 -8 Z" fill="#5a3818" stroke="#2a1408" strokeWidth="0.8" />
          <rect x="-10" y="-14" width="28" height="6" fill="#8a5a2e" stroke="#3a1810" strokeWidth="0.5" />
          {/* petit livre ouvert dessus */}
          <path d="M-6 -18 L6 -18 L4 -14 L-4 -14 Z" fill="#f0e8d0" stroke="#5a3818" strokeWidth="0.4" />
        </g>
      </PLayer>

      <PLayer depth={3}>
        {/* LE MAÎTRE VERRIER accroupi devant un panneau de vitrail en construction */}
        <g transform="translate(320,500)">
          <ellipse cx="0" cy="30" rx="26" ry="4" fill="#0a0604" opacity="0.55" />
          {/* à genoux, fer à souder vers le panneau */}
          <Figure x={0} y={30} s={0.71} pose="kneel" facing="right" skin="#c8946a" hair="#3a2010" look="short" beard="short" mood="vexe"
            hat="beret" hatColor="#1a1408" garment="tunic" coat="#5a6878" pants="#3a5828" shoes="#2a2010" apron="#8a7a60"
            arms={[{ a1: 20, a2: -10 }, { a1: 50, a2: 80 }]}>
            <path d="M50 -50 L70 -38" stroke="#3a2010" strokeWidth="3" strokeLinecap="round" />
            <rect x="68" y="-40" width="9" height="5" fill="#8a5828" transform="rotate(30 72 -38)" />
          </Figure>
        </g>
        {/* petit panneau de vitrail posé au sol devant lui */}
        <g transform="translate(360,510)">
          <rect x="0" y="0" width="60" height="40" fill="#3a2818" stroke="#1a1408" strokeWidth="0.8" />
          {[0, 20, 40].map((x, i) => (
            <rect key={`c${i}`} x={x + 2} y="2" width="18" height="17" fill={i === 0 ? "url(#ca-vit-r)" : i === 1 ? "url(#ca-vit-b)" : "url(#ca-vit-j)"} stroke="#1a1408" strokeWidth="0.6" />
          ))}
          {[0, 20, 40].map((x, i) => (
            <rect key={`c2${i}`} x={x + 2} y="21" width="18" height="17" fill={i === 0 ? "url(#ca-vit-j)" : i === 1 ? "url(#ca-vit-r)" : "url(#ca-vit-b)"} stroke="#1a1408" strokeWidth="0.6" />
          ))}
        </g>
        {/* Ephemere : morceau de verre coloré + copeau de pierre (disparaissent) */}
        {!inv.includes("verre_colore") && (
        <g transform="translate(160,542) rotate(15)">
          <path d="M-8 -4 L8 -6 L6 4 L-6 6 Z" fill="url(#ca-vit-r)" stroke="#1a1408" strokeWidth="0.5" opacity="0.9" />
        </g>
        )}
        {!inv.includes("copeau_pierre") && (
        <g transform="translate(920,542) rotate(-20)">
          <path d="M-6 0 L4 -4 L8 3 L-2 6 Z" fill="#e0d0b8" stroke="#5a4838" strokeWidth="0.5" />
        </g>
        )}
      </PLayer>

      <Hotspot cx={320} cy={478} r={40} label="le maître verrier" reveal={reveal} onClick={() => action("verrier")} />
      <Hotspot cx={500} cy={240} r={90} label="la grande rose" reveal={reveal} onClick={() => action("rose")} />
      <Hotspot cx={200} cy={320} r={60} label="vitrail latéral" reveal={reveal} onClick={() => action("vitrail")} />
      <Hotspot cx={800} cy={320} r={60} label="vitrail latéral" reveal={reveal} onClick={() => action("vitrail")} />
      <Hotspot cx={500} cy={370} r={50} label="tympan sculpté" reveal={reveal} onClick={() => action("tympan")} />
      {/* (corbeau de la rose retire — ne rendait pas comme attendu) */}
      <Hotspot cx={120} cy={300} r={60} label="échafaudage en bois" reveal={reveal} onClick={() => action("echafaudage")} />
      <Hotspot cx={160} cy={542} r={14} label="morceau de verre" item="verre_colore" reveal={reveal} onClick={() => collect("verre_colore")} />
      <Hotspot cx={920} cy={542} r={14} label="copeau de pierre" item="copeau_pierre" reveal={reveal} onClick={() => collect("copeau_pierre")} />
    </svg>
  );
}
