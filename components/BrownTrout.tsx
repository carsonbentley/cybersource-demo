/**
 * Original brown trout illustration (hand-built SVG, no third-party art).
 * Facing right. The tail and body are separate groups so CSS can animate a swim.
 */

// Black spots across the back, red spots with pale halos along the flank.
const BLACK_SPOTS: [number, number, number][] = [
  [110, 66, 3.2], [132, 58, 3.6], [150, 66, 3], [168, 54, 4], [186, 62, 3.4],
  [206, 52, 3], [222, 60, 4.2], [244, 54, 3.4], [262, 62, 3.8], [284, 56, 3.2],
  [302, 64, 3.6], [322, 60, 3], [340, 66, 2.6], [140, 76, 2.6], [196, 74, 3],
  [252, 76, 2.8], [292, 78, 3.2], [318, 76, 2.4], [352, 62, 2.2], [176, 84, 2.4],
];
const RED_SPOTS: [number, number, number][] = [
  [124, 84, 3.2], [162, 92, 3.6], [212, 88, 4], [236, 96, 3.2], [270, 92, 3.8],
  [306, 90, 3.2], [188, 98, 2.8], [334, 84, 2.6],
];

export function BrownTrout({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 150"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id="trout-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f3a17" />
          <stop offset="0.3" stopColor="#6b5420" />
          <stop offset="0.6" stopColor="#c08f2e" />
          <stop offset="0.82" stopColor="#ecc95c" />
          <stop offset="1" stopColor="#f6e7b0" />
        </linearGradient>
        <linearGradient id="trout-fin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b4a1d" />
          <stop offset="1" stopColor="#a5822f" />
        </linearGradient>
        <radialGradient id="trout-sheen" cx="0.62" cy="0.42" r="0.5">
          <stop offset="0" stopColor="#fff6c8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="trout-tail">
        <path
          d="M78 78 C62 66 42 46 16 34 C26 56 32 68 36 78 C32 88 26 102 16 124 C42 110 62 90 78 78 Z"
          fill="url(#trout-fin)"
        />
        <path d="M70 78 C54 66 38 52 24 44 M70 78 C54 90 38 104 24 114" stroke="#3b2f12" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
      </g>

      <g className="trout-body">
        {/* fins behind the body */}
        <path d="M196 46 C204 22 232 14 262 22 L266 48 Z" fill="url(#trout-fin)" />
        <path d="M118 60 C120 50 132 49 136 56 Z" fill="#7a5d22" />
        <path d="M140 104 C140 120 156 126 166 118 L164 104 Z" fill="url(#trout-fin)" />
        <path d="M206 110 C210 128 230 134 240 126 L238 110 Z" fill="url(#trout-fin)" />

        <path
          d="M72 78 C110 50 170 38 240 40 C300 42 348 54 380 72 C392 78 393 86 382 92 C352 106 300 116 240 116 C170 116 110 104 72 78 Z"
          fill="url(#trout-body)"
        />
        <path
          d="M72 78 C110 50 170 38 240 40 C300 42 348 54 380 72 C392 78 393 86 382 92 C352 106 300 116 240 116 C170 116 110 104 72 78 Z"
          fill="url(#trout-sheen)"
        />
        {/* lateral line */}
        <path d="M86 78 C160 74 260 74 340 72" stroke="#f6e7b0" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />

        {BLACK_SPOTS.map(([x, y, r]) => (
          <circle key={`b${x}-${y}`} cx={x} cy={y} r={r} fill="#1b1608" />
        ))}
        {RED_SPOTS.map(([x, y, r]) => (
          <g key={`r${x}-${y}`}>
            <circle cx={x} cy={y} r={r + 2.4} fill="#cfe0de" opacity="0.85" />
            <circle cx={x} cy={y} r={r} fill="#c2372a" />
          </g>
        ))}

        {/* head */}
        <path d="M338 58 C352 72 352 94 340 106" stroke="#3b2f12" strokeOpacity="0.55" strokeWidth="2" fill="none" />
        <path d="M318 96 C312 112 296 120 286 116 C294 106 304 100 318 96 Z" fill="#b8892c" />
        <circle cx="362" cy="72" r="6" fill="#f3d36a" />
        <circle cx="363" cy="72" r="3.2" fill="#111" />
        <circle cx="364.4" cy="70.6" r="1" fill="#fff" />
        <path d="M388 84 C380 87 372 88 364 87" stroke="#3b2f12" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A small dry fly (elk hair caddis style) used at the end of the fly line. */
export function DryFly({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 24" aria-hidden>
      <path d="M4 14 C10 6 24 4 34 10 L30 16 C22 12 12 12 4 14 Z" fill="#c9a24a" />
      <path d="M6 14 L32 14" stroke="#6b4e1d" strokeWidth="2" />
      <g stroke="#3a2a10" strokeWidth="1.2">
        <path d="M30 8 L33 2 M32 9 L37 4 M29 9 L28 3" />
      </g>
      <path d="M33 14 C36 18 34 22 30 22" stroke="#999" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
