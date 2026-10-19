import Hotspot from "../../../engine/Hotspot.jsx";
import { PLayer } from "../../../engine/Parallax.jsx";
import { Figure } from "../../../engine/chars.jsx";

/* ============================================================
   CHAPITRE 8 — Tableau : ENIAC, Moore School of Electrical
   Engineering, université de Pennsylvanie, Philadelphie, 1946.
   Une immense salle militaire pleine d'armoires électroniques
   noires, 18 000 tubes à vide qui clignotent en rangées, câbles
   au sol, tableau de plugboard sur le côté. Kay McNulty, l'une
   des six « ENIAC Girls », attend qu'on l'aide à programmer.
   ============================================================ */

export default function SceneEniac({ collect, action, reveal, made = [], flags = [] }) {
  const chargees = !!flags.fiches_chargees;
  const cablees  = !!flags.cables_branches;
  const allume   = made.includes("msg_eniac");

  /* les grandes armoires-baies alignées le long du mur du fond */
  const BAIES = [40, 180, 320, 640, 780];

  return (
    <svg viewBox="0 0 1000 560" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="en-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a4438" /><stop offset="100%" stopColor="#26221a" /></linearGradient>
        <linearGradient id="en-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6a604a" /><stop offset="100%" stopColor="#2c281c" /></linearGradient>
        <linearGradient id="en-baie" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4a4438" /><stop offset="50%" stopColor="#332e26" /><stop offset="100%" stopColor="#221e18" /></linearGradient>
        <radialGradient id="en-tube" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffd870" stopOpacity="1" /><stop offset="100%" stopColor="#ffa848" stopOpacity="0" /></radialGradient>
        <filter id="en-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        <radialGradient id="en-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffdb6a" stopOpacity="0.4" /><stop offset="100%" stopColor="#ffdb6a" stopOpacity="0" /></radialGradient>
      </defs>

      {/* ═══ mur du fond + halo ambiant quand allumé ═══ */}
      <PLayer depth={1}>
        <rect width="1000" height="560" fill="url(#en-wall)" />
        {allume && <rect width="1000" height="440" fill="url(#en-glow)" opacity="0.9" />}
        {/* fenêtres hautes avec store — atmosphère bureau militaire américain */}
        {/* plafond : tubes fluorescents (nouveauté des années 40) et gaine de ventilation */}
        <rect x="-40" y="-10" width="1080" height="22" fill="#1e1a14" />
        {[150, 400, 650, 900].map((x) => (
          <g key={x}>
            <path d={`M${x - 50} 12 v6 M${x + 50} 12 v6`} stroke="#141210" strokeWidth="1.4" />
            <rect x={x - 60} y="18" width="120" height="7" rx="3" fill="#e8f0e8" />
            <ellipse cx={x} cy="30" rx="90" ry="16" fill="#e8f4e0" opacity="0.16" filter="url(#en-blur)" />
          </g>
        ))}
        <rect x="-40" y="112" width="1080" height="16" fill="#3a362c" />
        <rect x="-40" y="112" width="1080" height="3" fill="#5a5444" />
        {[60, 200, 340, 660, 800].map((x) => <rect key={x} x={x + 30} y="126" width="40" height="8" fill="#2a2620" />)}
        {/* plaque de l'Ordnance Department */}
        <g transform="translate(330,74)">
          <rect x="-74" y="-16" width="148" height="32" fill="#2a2418" stroke="#8a7a50" strokeWidth="1.4" />
          <text x="0" y="-3" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="7.5" fill="#d8c890" letterSpacing="0.6">U.S. ARMY ORDNANCE</text>
          <text x="0" y="9" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6.5" fill="#a89870" letterSpacing="0.4">MOORE SCHOOL · 1946</text>
        </g>
        {/* au fond, dans l'angle du « U » : la suite des panneaux, plus loin */}
        <g>
          <rect x="440" y="196" width="200" height="190" fill="#1a1712" />
          {Array.from({ length: 6 }).map((_, k) => (
            <g key={k}>
              <rect x={446 + k * 32} y="204" width="28" height="170" fill="#2a261e" stroke="#0a0806" strokeWidth="1" />
              {Array.from({ length: 7 }).map((_, r) => [0, 1].map((c) => (
                <rect key={`${r}-${c}`} x={450 + k * 32 + c * 12} y={212 + r * 20} width="8" height="13" rx="1.5" fill={allume && (r + c + k) % 3 ? "#ffb848" : "#3a3428"} opacity="0.85" />
              )))}
            </g>
          ))}
          <rect x="440" y="196" width="200" height="190" fill="#0a0806" opacity="0.35" />
        </g>
        {[100, 700].map((x, i) => (
          <g key={i}>
            <rect x={x} y="40" width="140" height="60" fill="#8a9098" opacity="0.6" />
            {[45, 55, 65, 75, 85].map((y, j) => (
              <path key={j} d={`M${x} ${y} h140`} stroke="#3a3830" strokeWidth="0.6" opacity="0.6" />
            ))}
          </g>
        ))}
        {/* affichage horloge ronde institutionnelle */}
        <g transform="translate(500,72)">
          <circle r="24" fill="#f0e8d0" stroke="#3a2c18" strokeWidth="3" />
          <path d="M0 -18 L0 0 L14 4" stroke="#1a1006" strokeWidth="2" fill="none" strokeLinecap="round" />
          {[0, 90, 180, 270].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <path key={i} d={`M${Math.cos(rad) * 18} ${Math.sin(rad) * 18} L${Math.cos(rad) * 22} ${Math.sin(rad) * 22}`} stroke="#1a1006" strokeWidth="1.4" />;
          })}
        </g>
      </PLayer>

      {/* ═══ grand banc d'armoires ENIAC alignées ═══ */}
      <PLayer depth={1.5}>
        {BAIES.map((x, i) => (
          <g key={i}>
            <rect x={x} y="140" width="120" height="260" fill="url(#en-baie)" stroke="#0a0806" strokeWidth="2" />
            {/* rangées de tubes à vide qui clignotent */}
            {[...Array(6)].map((_, r) => [...Array(4)].map((_, c) => {
              const tubeX = x + 14 + c * 24;
              const tubeY = 160 + r * 34;
              const on = allume && (Math.floor((tubeX + tubeY + r + c + i) * 13) % 3 !== 0);
              return (
                <g key={`t-${r}-${c}`}>
                  <rect x={tubeX} y={tubeY} width="16" height="26" rx="3"
                    fill={on ? "#ffb848" : "#3a3428"} stroke="#0a0806" strokeWidth="0.8" />
                  {on && <circle cx={tubeX + 8} cy={tubeY + 13} r="10" fill="url(#en-tube)" opacity="0.85" />}
                </g>
              );
            }))}
            {/* bandeau de néons (affichage de l'accumulateur) */}
            <rect x={x + 6} y="144" width="108" height="10" fill="#141210" />
            {Array.from({ length: 10 }).map((_, k) => (
              <circle key={`n${k}`} cx={x + 12 + k * 10.6} cy="149" r="2.2" fill={allume && (k + i) % 3 !== 1 ? "#ff7a4a" : "#3a2a20"}>
                {allume && k % 2 === 0 && <animate attributeName="opacity" values="1;0.3;1" dur={`${0.6 + ((k + i) % 4) * 0.25}s`} repeatCount="indefinite" />}
              </circle>
            ))}
            {/* commutateurs rotatifs */}
            {[0, 1, 2, 3].map((k) => (
              <g key={`k${k}`} transform={`translate(${x + 22 + k * 25},368)`}>
                <circle r="6" fill="#1a1712" stroke="#6a6250" strokeWidth="1" />
                <path d={`M0 0 L${[4, -3, 0, 5][k]} ${[-4, -5, -6, 2][k]}`} stroke="#d8d0b0" strokeWidth="1.6" strokeLinecap="round" />
              </g>
            ))}
            {/* petite étiquette panneau */}
            <rect x={x + 20} y="380" width="80" height="14" fill="#0a0806" />
            <text x={x + 60} y="390" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="8" fill="#ffcf78">PANEL {String.fromCharCode(65 + i)}</text>
            {/* lampes-temoins qui clignotent quand la machine tourne */}
            {allume && [0, 1, 2].map((k) => (
              <circle key={`led-${k}`} cx={x + 26 + k * 22} cy={410} r="3.2"
                fill={["#ff6a4a", "#5eff9e", "#7fd8ff"][(i + k) % 3]}>
                <animate attributeName="opacity"
                  values="0.15;1;0.25;0.9;0.15"
                  dur={`${1.2 + ((i + k) % 3) * 0.4}s`}
                  begin={`${(i * 0.13 + k * 0.31) % 1}s`}
                  repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        ))}

        {/* les gros faisceaux de câbles qui courent d'une baie à l'autre */}
        {[[40, 440], [640, 900]].map(([a, b], i) => (
          <g key={i}>
            <path d={`M${a} 136 H${b}`} stroke="#141210" strokeWidth="9" />
            <path d={`M${a} 134 H${b}`} stroke="#3a362c" strokeWidth="2" />
            {Array.from({ length: Math.floor((b - a) / 40) }).map((_, k) => <path key={k} d={`M${a + 20 + k * 40} 131 v10`} stroke="#5a5444" strokeWidth="2" />)}
          </g>
        ))}
        {/* FENTE-lecteur de fiches sur la baie de gauche (PANEL A) : quand
            les fiches sont chargees, une pile de cartes perforees depasse. */}
        <g transform="translate(100,300)">
          <rect x="-16" y="-6" width="32" height="14" rx="1.5" fill="#0a0806" stroke="#c8963e" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="6" fill="#c8963e" letterSpacing="0.5">CARDS ▸</text>
          {chargees && (
            <g transform="translate(0,-10)">
              {[0, 2, 4].map((dy, i) => (
                <g key={i} transform={`translate(${-i * 0.6},${-dy})`}>
                  <rect x="-14" y="-4" width="28" height="10" fill="#f0e8d0" stroke="#5a4028" strokeWidth="0.5" />
                  {/* perforations */}
                  {[-10, -6, -2, 2, 6, 10].map((px, j) => (
                    <rect key={j} x={px - 0.5} y={-1 + (j % 2) * 3} width="1" height="1.6" fill="#3a2818" />
                  ))}
                </g>
              ))}
            </g>
          )}
        </g>

        {/* câbles serpentant au sol entre les baies — APPARAISSENT seulement
            une fois les cables branches par le joueur */}
        {cablees && (
          <g>
            <path d="M160 400 Q300 420 460 400 Q620 380 760 400" stroke="#c83020" strokeWidth="3.5" fill="none" opacity="0.9" />
            <path d="M180 402 Q320 424 480 402 Q640 380 780 402" stroke="#3a80c8" strokeWidth="2.4" fill="none" opacity="0.8" />
            <path d="M200 406 Q340 428 500 406 Q660 384 800 406" stroke="#c8c830" strokeWidth="2" fill="none" opacity="0.7" />
          </g>
        )}

        {/* CAFARDS (le vrai bug de l'ENIAC !) : plusieurs qui trottent,
            certains lentement, d'autres plus vite, dans les deux sens et
            a des hauteurs differentes (mur, sol, mi-hauteur derriere les
            baies). */}
        {[
          { from: "1020,110", to: "-30,120",   dur: 42, op: 0.7,  flip: false },
          { from: "-30,400",  to: "1020,395",  dur: 55, op: 0.6,  flip: true  },
          { from: "-30,230",  to: "1020,220",  dur: 34, op: 0.65, flip: true  },
          { from: "1020,510", to: "-30,505",   dur: 28, op: 0.7,  flip: false },
          { from: "1020,310", to: "-30,320",   dur: 48, op: 0.55, flip: false },
          { from: "-30,60",   to: "1020,68",   dur: 60, op: 0.5,  flip: true  },
          { from: "500,540",  to: "50,470",    dur: 22, op: 0.6,  flip: false },
          { from: "700,450",  to: "980,540",   dur: 26, op: 0.55, flip: true  },
        ].map((c, i) => (
          <g key={i} opacity={c.op}>
            <animateTransform attributeName="transform" type="translate"
              values={`${c.from}; ${c.to}; ${c.from}`}
              dur={`${c.dur}s`} repeatCount="indefinite" />
            <g transform={c.flip ? "scale(-1,1)" : undefined}>
              <ellipse cx="0" cy="0" rx="4" ry="2.4" fill="#1a1006" />
              <circle cx="4" cy="0" r="1.6" fill="#1a1006" />
              <path d="M-3 -2 l-3 -1 M-3 0 l-3 0 M-3 2 l-3 1 M3 -2 l3 -1 M3 2 l3 1" stroke="#1a1006" strokeWidth="0.5" />
              <path d="M5 -1 l3 -2 M5 1 l3 2" stroke="#1a1006" strokeWidth="0.5" />
            </g>
          </g>
        ))}
      </PLayer>

      {/* ═══ sol + tables + plugboard ═══ */}
      <PLayer depth={2.5}>
        <rect y="440" width="1000" height="120" fill="url(#en-floor)" />
        {/* dalles de linoléum en damier, en perspective */}
        {Array.from({ length: 5 }).map((_, r) => {
          const y0 = 440 + r * r * 3.2 + r * 10, y1 = 440 + (r + 1) * (r + 1) * 3.2 + (r + 1) * 10;
          return Array.from({ length: 16 }).map((_, c) => {
            const xa = -300 + c * 100, xb = xa + 100;
            const k0 = 0.62 + (y0 - 440) / 300, k1 = 0.62 + (y1 - 440) / 300;
            const X = (x, k) => (500 + (x - 500) * k).toFixed(1);
            return (r + c) % 2 ? <path key={`${r}-${c}`} d={`M${X(xa, k0)} ${y0} L${X(xb, k0)} ${y0} L${X(xb, k1)} ${y1} L${X(xa, k1)} ${y1} Z`} fill="#2a261c" opacity="0.5" /> : null;
          });
        })}
        <rect y="438" width="1000" height="5" fill="#141210" />
        {allume && <ellipse cx="300" cy="450" rx="320" ry="22" fill="#ffb848" opacity="0.14" filter="url(#en-blur)" />}
        {/* PLUGBOARD debout à gauche : grand tableau avec des trous et des câbles pendants */}
        <g transform="translate(490,300)">
          <rect x="-56" y="0" width="112" height="140" fill="#2a2418" stroke="#0a0806" strokeWidth="2" />
          <rect x="-52" y="6" width="104" height="128" fill="#3a3020" />
          {/* grille de prises */}
          {[...Array(10)].map((_, r) => [...Array(8)].map((_, c) => (
            <circle key={`p-${r}-${c}`} cx={-42 + c * 12} cy={16 + r * 12} r="2.2" fill="#0a0806" stroke="#8a5820" strokeWidth="0.4" />
          )))}
          {/* câbles branchés — n'apparaissent qu'une fois qu'on les a
              vraiment brancher sur le plugboard */}
          {cablees && [
            "M-30 22 Q-10 60 20 40",
            "M-6 34 Q10 80 30 60",
            "M18 22 Q-4 70 -20 90",
          ].map((d, i) => (
            <path key={i} d={d} stroke={["#c83020", "#3a80c8", "#c8c830"][i]} strokeWidth="2.4" fill="none" opacity="0.9" />
          ))}
          <text y="150" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="9" fill="#c8963e">PLUGBOARD</text>
        </g>

        {/* TABLE de KAY à droite avec les fiches de calcul et le rouleau de câbles */}
        <g>
          <rect x="700" y="420" width="230" height="16" fill="#5a4028" stroke="#1a1006" strokeWidth="2" />
          <rect x="712" y="436" width="10" height="60" fill="#3a2818" />
          <rect x="908" y="436" width="10" height="60" fill="#3a2818" />
          {/* pile de FICHES de calcul (à ramasser) */}
          {!chargees && !allume && (
            <g transform="translate(760,410)">
              <rect x="-16" y="-4" width="32" height="14" fill="#f0e8d0" stroke="#5a4028" strokeWidth="1" />
              <rect x="-14" y="-8" width="32" height="14" fill="#f8f0d8" stroke="#5a4028" strokeWidth="1" />
              <rect x="-12" y="-12" width="32" height="14" fill="#fff8e0" stroke="#5a4028" strokeWidth="1" />
              <path d="M-8 -8 h24 M-8 -4 h20 M-8 0 h22" stroke="#3a2818" strokeWidth="0.5" />
            </g>
          )}
          {/* rouleau de CÂBLES enroulés (à ramasser) */}
          {!allume && (
            <g transform="translate(870,410)">
              <ellipse cx="0" cy="0" rx="20" ry="10" fill="#3a2818" />
              {[6, 10, 14].map((r, i) => (
                <ellipse key={i} cx="0" cy={-i * 3} rx={r + 4} ry={2.5} fill="none" stroke={["#c83020", "#3a80c8", "#c8c830"][i]} strokeWidth="2" />
              ))}
              {/* extrémités qui pendouillent */}
              <path d="M10 4 q4 8 -2 14" stroke="#c83020" strokeWidth="1.5" fill="none" />
              <path d="M-10 4 q-4 8 2 14" stroke="#3a80c8" strokeWidth="1.5" fill="none" />
            </g>
          )}
        </g>
      </PLayer>

      {/* ═══ AVANT-PLAN : KAY McNULTY debout devant l'ENIAC ═══ */}
      <PLayer depth={3}>
        <g transform="translate(830,340)">
          {/* debout en tailleur, un cahier de notes à la main */}
          <Figure x={0} y={130} s={1.23} skin="#ecc8a4" hair="#5a3820" look="rolls" lips="#c02030" mood="content"
            garment="dress" coat="#3a5060" pants="#c8a888" shoes="#2a1a10" belt={false} arms={[{ a1: 20, a2: -20 }, { a1: 10, a2: 6 }]}>
            <path d="M-21 -46 L21 -46 L26 -14 Q0 -11 -26 -14 Z" fill="#243848" />
            <path d="M-5 -91 L0 -78 L5 -91 L8 -72 L-8 -72 Z" fill="#efe6d2" />
            <rect x="-30" y="-56" width="12" height="16" fill="#efe6d2" stroke="#5a4028" strokeWidth="0.8" />
            <path d="M-28 -52 h8 M-28 -48 h6 M-28 -44 h8" stroke="#3a2818" strokeWidth="0.5" />
            <circle cx="-19.8" cy="-46.9" r="4.4" fill="#ecc8a4" stroke="#a88060" strokeWidth="0.6" />
          </Figure>
        </g>

        {/* « ? » de quête au-dessus de Kay (tant que l'ENIAC n'est pas allumé) */}
        {/* bandeau de résultat quand allumé : imprimante qui crache */}
        {allume && (
          <g transform="translate(500,470)">
            <rect x="-80" y="-8" width="160" height="18" fill="#f0e8d0" stroke="#5a4028" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="10" fill="#5a3818">TRAJECTOIRE : 12.4s  ANGLE 42°  OK</text>
          </g>
        )}
      </PLayer>

      {/* ═══ zones cliquables ═══ */}
      <Hotspot cx={830} cy={370} r={54} label="Kay McNulty" reveal={reveal} onClick={() => action("kay")} />
      {!chargees && !allume && (
        <Hotspot cx={760} cy={410} r={26} label="pile de fiches de calcul" item="fiches_calcul" reveal={reveal} onClick={() => collect("fiches_calcul")} />
      )}
      {!allume && (
        <Hotspot cx={870} cy={412} r={26} label="rouleau de câbles" item="cables" reveal={reveal} onClick={() => collect("cables")} />
      )}
      {/* l'ENIAC = les grandes baies : cible de dépôt (support) — MAIS
          une fois les câbles branchés, clique dessus ouvre le mini-jeu
          de débuggage (bugs + tubes grillés) avant d'accepter msg_eniac. */}
      {!cablees && (
        <Hotspot cx={100} cy={300} r={38} label={chargees ? "la fente est deja pleine" : "la fente à cartes — glisse les fiches ici"} item="eniac_fente" reveal={reveal} />
      )}
      {cablees && !allume && (
        <Hotspot cx={220} cy={270} r={100} label="l'ENIAC — débuguer avant de lancer !" reveal={reveal} onClick={() => action("eniac_debug")} />
      )}
      {allume && (
        <Hotspot cx={220} cy={270} r={100} label="l'ENIAC (opérationnel)" reveal={reveal} />
      )}
      {/* plugboard : reste cible de dépôt tant qu'on n'a pas branché,
          puis devient bouton du mini-jeu de débuggage comme les baies */}
      {!cablees && (
        <Hotspot cx={490} cy={370} r={60} label={chargees ? "le plugboard — glisse-y les câbles" : "le plugboard — vide pour l'instant"} item="eniac_machine" reveal={reveal} />
      )}
      {cablees && !allume && (
        <Hotspot cx={490} cy={370} r={60} label="le plugboard — lance le débuggage" reveal={reveal} onClick={() => action("eniac_debug")} />
      )}
      {allume && (
        <Hotspot cx={490} cy={370} r={60} label="le plugboard (programme lancé)" reveal={reveal} />
      )}
    </svg>
  );
}
