const pixel = (x, y, color, width = 2, height = 2) => (
  <rect key={`${x}-${y}-${color}`} x={x} y={y} width={width} height={height} fill={color} />
);

export default function PixelZoro({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Three tiny swords behind the lost swordsman. */}
      {[
        [6, 4], [8, 6], [10, 8], [12, 10], [14, 12], [16, 14], [18, 16], [20, 18], [22, 20], [24, 22],
        [14, 4], [12, 6], [10, 8], [8, 10], [6, 12], [4, 14], [2, 16], [0, 18],
        [26, 6], [24, 8], [22, 10], [20, 12], [18, 14], [16, 16], [14, 18], [12, 20], [10, 22], [8, 24],
      ].map(([x, y], index) => (
        <rect key={`sword-${index}`} x={x} y={y} width="2" height="2" fill={index % 2 ? '#e6db74' : '#ae81ff'} />
      ))}
      {/* Green hair, skin, and dark green coat in the site's pixel palette. */}
      {[
        [10, 5, '#a6e22e', 12, 4], [8, 8, '#a6e22e', 16, 4],
        [10, 12, '#e6db74', 12, 6], [8, 14, '#f8f8f2', 16, 2],
        [11, 18, '#45463e', 10, 2], [8, 20, '#a6e22e', 16, 7],
        [6, 22, '#a6e22e', 4, 4], [22, 22, '#a6e22e', 4, 4],
        [12, 12, '#171814', 2, 2], [18, 12, '#171814', 2, 2],
        [14, 16, '#f92672', 4, 2],
      ].map(([x, y, color, width, height]) => pixel(x, y, color, width, height))}
      <path d="M13 22h6M14 24h4" stroke="#171814" strokeWidth="2" />
      <path d="m4 29 3-2m21 2-3-2" stroke="#ae81ff" strokeWidth="2" />
    </svg>
  );
}
