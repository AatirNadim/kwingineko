/**
 * PixelIcon.jsx
 * Authentic, razor-sharp retro Monokai pixel art symbols for social platforms.
 * Uses exact 12x12 pixel character grids rendered via crisp SVG rects with shapeRendering="crispEdges".
 */

export const PIXEL_ICONS = {
  // LinkedIn: Monokai-harmonized brand blue (#0a66c2) rounded badge with crisp white (#f8f8f2) 'in'
  linkedin: {
    size: 12,
    palette: {
      b: '#0a66c2',
      w: '#f8f8f2',
    },
    grid: [
      '..bbbbbbbb..',
      '.bbbbbbbbbb.',
      '.bbbbbbbbbb.',
      '.bbwbbbbbbb.',
      '.bbbbbbbbbb.',
      '.bbwbwwwwbb.',
      '.bbwbwbbwbb.',
      '.bbwbwbbwbb.',
      '.bbwbwbbwbb.',
      '.bbwbwbbwbb.',
      '.bbbbbbbbbb.',
      '..bbbbbbbb..',
    ],
  },

  // GitHub: Crisp Monokai white (#f8f8f2) Octocat silhouette with pointed ears, cheeks, and curved tentacles
  github: {
    size: 12,
    palette: {
      w: '#f8f8f2',
    },
    grid: [
      '..w......w..',
      '.www....www.',
      '.wwww..wwww.',
      'wwwwwwwwwwww',
      'wwwwwwwwwwww',
      'wwwwwwwwwwww',
      '.wwwwwwwwww.',
      '..wwwwwwww..',
      '...wwwwww...',
      '..wwwwwwww..',
      '.ww.wwww.ww.',
      'ww...ww...ww',
    ],
  },

  // Hashnode: Vibrant developer blue badge (#2962ff) with crisp white (#f8f8f2) diamond node
  hashnode: {
    size: 12,
    palette: {
      b: '#2962ff',
      w: '#f8f8f2',
    },
    grid: [
      '..bbbbbbbb..',
      '.bbbbbbbbbb.',
      '.bbbbwwbbbb.',
      '.bbbwwwwbbb.',
      '.bbwwwwwwbb.',
      '.bwwbbbbwwb.',
      '.bwwbbbbwwb.',
      '.bbwwwwwwbb.',
      '.bbbwwwwbbb.',
      '.bbbbwwbbbb.',
      '.bbbbbbbbbb.',
      '..bbbbbbbb..',
    ],
  },

  // LeetCode: Iconic Monokai-tuned orange bracket (#ffa116) with crisp white (#f8f8f2) syntax hyphen
  leetcode: {
    size: 12,
    palette: {
      o: '#ffa116',
      w: '#f8f8f2',
    },
    grid: [
      '............',
      '.......ooo..',
      '.....oooo...',
      '....oooo....',
      '...oooo.wwww',
      '..oooo..wwww',
      '.oooo.......',
      '..oooo......',
      '...oooo.....',
      '....oooo....',
      '.....ooooooo',
      '......oooooo',
    ],
  },

  // Google Cloud / GCP: Official 4-color cloud emblem (#4285f4 blue, #ea4335 red, #fbbc05 yellow, #34a853 green)
  gcp: {
    size: 12,
    palette: {
      b: '#4285f4',
      r: '#ea4335',
      y: '#fbbc05',
      g: '#34a853',
    },
    grid: [
      '............',
      '............',
      '.....bbbr...',
      '...bbbbbrrr.',
      '..bb.....rrr',
      '.bb.......yy',
      '.bb.......yy',
      '.bb.......yy',
      '..gg.....yy.',
      '..gggggggg..',
      '...gggggg...',
      '............',
    ],
  },

  // Fallback: Retro terminal workstation pixel globe in Monokai lime (#a6e22e)
  fallback: {
    size: 12,
    palette: {
      c: '#a6e22e',
    },
    grid: [
      '............',
      '....cccc....',
      '..cc.cc.cc..',
      '.cc..cc..cc.',
      '.cc..cc..cc.',
      'cccccccccccc',
      'cccccccccccc',
      '.cc..cc..cc.',
      '.cc..cc..cc.',
      '..cc.cc.cc..',
      '....cccc....',
      '............',
    ],
  },
};

/**
 * Normalizes any platform name or icon key to a supported sprite key.
 */
export function normalizeIconName(name) {
  if (!name) return 'fallback';
  const n = String(name).trim().toLowerCase();

  if (n === 'linkedin' || n === 'li') return 'linkedin';
  if (n === 'github' || n === 'gh' || n === 'octocat') return 'github';
  if (n === 'hashnode' || n === 'blog') return 'hashnode';
  if (n === 'leetcode' || n === 'lc') return 'leetcode';
  if (n === 'gcp' || n.includes('cloud') || n.includes('google') || n.includes('skills boost')) return 'gcp';
  if (n === 'globe' || n === 'terminal' || n === 'external' || n === 'web' || n === 'fallback') return 'fallback';

  return 'fallback';
}

export default function PixelIcon({ name, size = 16, className = '', ...props }) {
  const iconKey = normalizeIconName(name);
  const iconData = PIXEL_ICONS[iconKey] || PIXEL_ICONS.fallback;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${iconData.size} ${iconData.size}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={`shrink-0 [image-rendering:pixelated] select-none ${className}`.trim()}
      {...props}
    >
      {iconData.grid.flatMap((row, y) =>
        [...row].map((pixel, x) => {
          const fill = iconData.palette[pixel];
          if (!fill || fill === 'transparent') return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={fill}
            />
          );
        })
      )}
    </svg>
  );
}
