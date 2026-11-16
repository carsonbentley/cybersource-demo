import type { Product } from "@/lib/products";

/** Original SVG product art, drawn on a brown trout skin backdrop. */
export function ProductImage({ product, size = "large" }: { product: Product; size?: "large" | "small" }) {
  const [from, to] = product.colors;
  return (
    <div
      className={`product-image product-image-${size}`}
      style={{ "--art-from": from, "--art-to": to } as React.CSSProperties}
      aria-hidden
    >
      <ProductArt id={product.id} />
    </div>
  );
}

function ProductArt({ id }: { id: string }) {
  switch (id) {
    case "drift-5wt-fly-rod":
      return <RodArt />;
    case "tailwater-sealed-reel":
      return <ReelArt />;
    case "riverbend-breathable-waders":
      return <WadersArt />;
    case "trout-essentials-fly-box":
      return <FlyBoxArt />;
    default:
      return null;
  }
}

function RodArt() {
  return (
    <svg className="art" viewBox="0 0 320 200">
      <path
        className="art-line"
        d="M292 26 C240 10 150 30 120 70 C96 104 150 120 200 110 C250 100 270 150 230 176"
        fill="none"
        stroke="#f2c94c"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <g className="art-float">
        <line x1="40" y1="176" x2="292" y2="26" stroke="#2b1d0e" strokeWidth="5" strokeLinecap="round" />
        <line x1="40" y1="176" x2="292" y2="26" stroke="#6b4423" strokeWidth="3" strokeLinecap="round" />
        {[0.42, 0.56, 0.68, 0.79, 0.89].map((t) => (
          <circle key={t} cx={40 + 252 * t} cy={176 - 150 * t - 4} r="3" fill="none" stroke="#d9d4c7" strokeWidth="1.4" />
        ))}
        <rect x="58" y="146" width="56" height="16" rx="7" transform="rotate(-30.8 86 154)" fill="#d8b07a" />
        {[66, 74, 82, 90, 98, 106].map((x) => (
          <line key={x} x1={x} y1="146" x2={x} y2="162" stroke="#b88b55" strokeWidth="1.2" transform="rotate(-30.8 86 154)" />
        ))}
        <rect x="38" y="164" width="22" height="12" rx="3" transform="rotate(-30.8 49 170)" fill="#a8a39a" />
      </g>
    </svg>
  );
}

function ReelArt() {
  const ports = Array.from({ length: 6 }, (_, i) => (i * Math.PI) / 3);
  return (
    <svg className="art" viewBox="0 0 320 200">
      <g className="art-float">
        <circle cx="160" cy="100" r="74" fill="#1f2a24" />
        <circle cx="160" cy="100" r="68" fill="#3b4a3f" stroke="#c9c3b3" strokeWidth="3" />
        <g className="art-spin" style={{ transformOrigin: "160px 100px" }}>
          {ports.map((a) => (
            <ellipse
              key={a}
              cx={160 + Math.cos(a) * 40}
              cy={100 + Math.sin(a) * 40}
              rx="15"
              ry="11"
              transform={`rotate(${(a * 180) / Math.PI} ${160 + Math.cos(a) * 40} ${100 + Math.sin(a) * 40})`}
              fill="#f2c94c"
              opacity="0.9"
            />
          ))}
          <circle cx="160" cy="100" r="16" fill="#c9c3b3" />
          <circle cx="160" cy="100" r="6" fill="#6b4423" />
          <rect x="206" y="58" width="14" height="30" rx="7" fill="#6b4423" transform="rotate(35 213 73)" />
        </g>
      </g>
    </svg>
  );
}

function WadersArt() {
  return (
    <svg className="art" viewBox="0 0 320 200">
      <g className="art-float">
        <path d="M128 18 L140 60 M192 18 L180 60" stroke="#2b1d0e" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M118 56 L202 56 L208 118 L194 172 L166 172 L162 120 L158 120 L154 172 L126 172 L112 118 Z"
          fill="#4d5b3c"
          stroke="#2b3322"
          strokeWidth="2"
        />
        <rect x="140" y="66" width="40" height="22" rx="4" fill="#3c4730" stroke="#2b3322" strokeWidth="1.5" />
        <path d="M144 72 L176 72" stroke="#f2c94c" strokeWidth="2" />
        <path d="M120 166 L160 166 L162 184 L108 184 C108 176 114 168 120 166 Z" fill="#2b1d0e" />
        <path d="M160 166 L200 166 C206 168 212 176 212 184 L158 184 Z" fill="#2b1d0e" />
        <path d="M126 150 L154 150 M166 150 L194 150" stroke="#6b5b3e" strokeWidth="6" />
      </g>
    </svg>
  );
}

const FLY_COLORS = ["#c9a24a", "#6b4423", "#d9d4c7", "#8a9a5b", "#c2372a", "#2b1d0e"];

function FlyBoxArt() {
  return (
    <svg className="art" viewBox="0 0 320 200">
      <g className="art-float">
        <rect x="58" y="30" width="204" height="140" rx="12" fill="#e8e1cf" stroke="#2b1d0e" strokeWidth="3" />
        <rect x="70" y="42" width="180" height="116" rx="6" fill="#3a3f33" />
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 6 }).map((__, col) => {
            const x = 88 + col * 29;
            const y = 58 + row * 28;
            const c = FLY_COLORS[(row * 6 + col) % FLY_COLORS.length];
            return (
              <g key={`${row}-${col}`} className="art-fly" style={{ animationDelay: `${(row + col) * 90}ms` }}>
                <path d={`M${x - 9} ${y + 4} C${x - 4} ${y - 6} ${x + 6} ${y - 6} ${x + 10} ${y + 1} L${x + 7} ${y + 6} Z`} fill={c} />
                <path d={`M${x + 8} ${y + 4} C${x + 12} ${y + 8} ${x + 10} ${y + 12} ${x + 6} ${y + 11}`} stroke="#bbb" strokeWidth="1" fill="none" />
              </g>
            );
          }),
        )}
      </g>
    </svg>
  );
}
