/**
 * Hashnode RSS Feed parser and client for Aatir Nadim's portfolio.
 * Fetches and parses publication dispatches from https://techtom.hashnode.dev/rss.xml
 */

export const DEFAULT_FEED_URL = 'https://techtom.hashnode.dev/rss.xml';
export const DEFAULT_HOST = 'techtom.hashnode.dev';
const CACHE_KEY_PREFIX = 'kwingineko_hashnode_rss_';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

// In-memory cache for ultra-fast component re-renders and route navigation
const memoryCache = new Map();

/**
 * Strips CDATA wrapping and trims whitespace.
 * @param {string} str
 * @returns {string}
 */
export function cleanCDATA(str) {
  if (!str) return '';
  return String(str)
    .replace(/^<!\[CDATA\[/i, '')
    .replace(/\]\]>$/i, '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .trim();
}

/**
 * Derives a clean post slug from an article URL or guid.
 * e.g. "https://techtom.hashnode.dev/multi-agent-orchestration" -> "multi-agent-orchestration"
 * @param {string} urlStr
 * @param {string} [guid]
 * @returns {string}
 */
export function extractSlug(urlStr, guid) {
  const target = (urlStr || guid || '').trim();
  if (!target) return '';
  try {
    const u = new URL(target);
    const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    return parts.pop() || target;
  } catch {
    const parts = target.split('/').filter(Boolean);
    return parts.pop() || target;
  }
}

/**
 * Formats pubDate string to a retro-styled short publication date e.g. "Jul 23, 2026".
 * Uses UTC so publication calendar day does not shift across time zones.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatPublicationDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return String(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(d);
  } catch {
    return String(dateStr);
  }
}

/**
 * Calculates reading time matching Hashnode's site formula:
 * Clean word count divided by 225 words per minute, rounded to closest integer.
 * @param {string} content - Raw HTML or markdown text
 * @returns {{ minutes: number, text: string, words: number }}
 */
export function calculateReadTime(content) {
  if (!content) {
    return { minutes: 1, text: '1 min read', words: 0 };
  }

  // Strip HTML tags and common entities
  const stripped = String(content)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  const words = stripped ? stripped.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.round(words / 225));

  return {
    minutes,
    text: `${minutes} min read`,
    words,
  };
}

/**
 * Fallback regex-based parser for Node/SSR environments or malformed DOMParser cases.
 * @param {string} xmlText
 * @returns {Array<Object>}
 */
function parseWithRegex(xmlText) {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const articles = [];
  let match;
  let idx = 0;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    idx++;
    const raw = match[1];

    const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? cleanCDATA(titleMatch[1]) : 'Untitled Dispatch';

    const descMatch = raw.match(/<description>([\s\S]*?)<\/description>/i);
    const description = descMatch ? cleanCDATA(descMatch[1]) : '';

    const linkMatch = raw.match(/<link>([\s\S]*?)<\/link>/i);
    const url = linkMatch ? cleanCDATA(linkMatch[1]) : '';

    const guidMatch = raw.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i);
    const guid = guidMatch ? cleanCDATA(guidMatch[1]) : '';

    const pubDateMatch = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const pubDate = pubDateMatch ? cleanCDATA(pubDateMatch[1]) : '';

    const encMatch = raw.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
    let cover = encMatch ? encMatch[1].trim() : '';

    const contentMatch =
      raw.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i) ||
      raw.match(/<encoded>([\s\S]*?)<\/encoded>/i);
    const content = contentMatch ? cleanCDATA(contentMatch[1]) : '';

    if (!cover && content) {
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) cover = imgMatch[1].trim();
    }

    const { minutes: readTimeInMinutes, text: readTime, words } = calculateReadTime(
      content || description
    );

    const tags = [];
    const catRegex = /<category>([\s\S]*?)<\/category>/gi;
    let catMatch;
    while ((catMatch = catRegex.exec(raw)) !== null) {
      const cat = cleanCDATA(catMatch[1]);
      if (cat && !tags.includes(cat)) {
        tags.push(cat);
      }
    }

    const slug = extractSlug(url, guid);
    const id = slug || `dispatch-${idx}`;
    const category = tags.length > 0 ? tags[0] : 'Engineering';
    const date = formatPublicationDate(pubDate);

    articles.push({
      id,
      slug,
      title,
      description,
      url,
      cover,
      readTime,
      readTimeInMinutes,
      words,
      date,
      publishedAt: pubDate,
      tags,
      category,
      views: 0,
      reactionCount: 0,
    });
  }

  return articles;
}

/**
 * Parses raw RSS 2.0 XML string into normalized article objects.
 * Uses browser DOMParser with automatic regex fallback for maximum resilience.
 *
 * @param {string} xmlText - Raw XML string from feed
 * @returns {Array<Object>} Array of normalized article objects
 */
export function parseHashnodeRSS(xmlText) {
  if (!xmlText || typeof xmlText !== 'string') {
    throw new Error('Empty or invalid XML response received from feed.');
  }

  let doc = null;

  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      doc = parser.parseFromString(xmlText, 'text/xml');
      if (doc.querySelector('parsererror')) {
        doc = parser.parseFromString(xmlText, 'text/html');
      }
    } catch {
      doc = null;
    }
  }

  // If DOMParser is unavailable or errored out, use regex parser
  if (!doc || doc.querySelector('parsererror')) {
    return parseWithRegex(xmlText);
  }

  const itemNodes = [...doc.getElementsByTagName('item')];
  if (itemNodes.length === 0) {
    const entries = [...doc.getElementsByTagName('entry')];
    if (entries.length === 0) {
      return parseWithRegex(xmlText);
    }
  }

  return itemNodes.map((item, idx) => {
    const getTagText = (names) => {
      for (const name of names) {
        const el = item.getElementsByTagName(name)[0];
        if (el?.textContent) return cleanCDATA(el.textContent);
      }
      return '';
    };

    const title = getTagText(['title']) || 'Untitled Dispatch';
    const description = getTagText(['description', 'summary']) || '';
    const link = getTagText(['link']) || '';
    const guid = getTagText(['guid', 'id']) || '';
    const pubDate = getTagText(['pubDate', 'published', 'updated', 'dc:date']) || '';

    // Extract cover image from <enclosure url="..." />
    const enclosure = item.getElementsByTagName('enclosure')[0];
    let cover = enclosure?.getAttribute('url')?.trim() || '';

    // Extract content:encoded
    let content = '';
    const encodedNS = item.getElementsByTagNameNS(
      'http://purl.org/rss/1.0/modules/content/',
      'encoded'
    )[0];
    if (encodedNS?.textContent) {
      content = cleanCDATA(encodedNS.textContent);
    } else {
      content = getTagText(['content:encoded', 'encoded', 'content']);
    }

    // Fallback: search for first <img> inside content
    if (!cover && content) {
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) cover = imgMatch[1].trim();
    }

    // Hashnode 225 wpm reading time calculation
    const { minutes: readTimeInMinutes, text: readTime, words } = calculateReadTime(
      content || description
    );

    // Extract category tags
    const catNodes = [...item.getElementsByTagName('category')];
    const tags = [];
    for (const catEl of catNodes) {
      const tagText = cleanCDATA(catEl.textContent);
      if (tagText && !tags.includes(tagText)) {
        tags.push(tagText);
      }
    }

    const slug = extractSlug(link, guid);
    const id = slug || `dispatch-${idx + 1}`;
    const category = tags.length > 0 ? tags[0] : 'Engineering';
    const date = formatPublicationDate(pubDate);

    return {
      id,
      slug,
      title,
      description,
      url: link,
      cover,
      readTime,
      readTimeInMinutes,
      words,
      date,
      publishedAt: pubDate,
      tags,
      category,
      views: 0,
      reactionCount: 0,
    };
  });
}

/**
 * Reads cached articles from memory or localStorage.
 */
function getCachedRSS(url) {
  const cacheKey = `${CACHE_KEY_PREFIX}${url}`;
  const now = Date.now();

  const memEntry = memoryCache.get(cacheKey);
  if (memEntry && now - memEntry.timestamp < CACHE_TTL_MS) {
    return memEntry.data;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed.timestamp === 'number' &&
          now - parsed.timestamp < CACHE_TTL_MS &&
          Array.isArray(parsed.data) &&
          parsed.data.length > 0
        ) {
          memoryCache.set(cacheKey, parsed);
          return parsed.data;
        }
      }
    } catch {
      // Ignore localStorage access restrictions
    }
  }

  return null;
}

/**
 * Writes cached articles to memory and localStorage.
 */
function setCachedRSS(url, data) {
  const cacheKey = `${CACHE_KEY_PREFIX}${url}`;
  const payload = { timestamp: Date.now(), data };

  memoryCache.set(cacheKey, payload);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch {
      // Ignore quota restrictions
    }
  }
}

/**
 * Clears the cached RSS articles.
 * @param {string} [url=DEFAULT_FEED_URL]
 */
export function clearHashnodeCache(url = DEFAULT_FEED_URL) {
  const cacheKey = `${CACHE_KEY_PREFIX}${url}`;
  memoryCache.delete(cacheKey);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(cacheKey);
    } catch {
      // Ignore
    }
  }
}

/**
 * Fetches and parses articles from Hashnode RSS feed using a resilient multi-tier CORS strategy:
 * Tier 1: Same-origin proxy endpoint (/api/feed or /api/hashnode) - dev server & Vercel
 * Tier 2: Direct fetch (https://techtom.hashnode.dev/rss.xml)
 * Tier 3: Public CORS proxies (allorigins, corsproxy.io)
 *
 * @param {Object} [options]
 * @param {string} [options.url=DEFAULT_FEED_URL] - RSS feed URL
 * @param {boolean} [options.forceRefresh=false] - Bypass cache
 * @returns {Promise<Array<Object>>} Normalized articles array
 */
export async function fetchHashnodeRSS({
  url = DEFAULT_FEED_URL,
  forceRefresh = false,
} = {}) {
  if (!forceRefresh) {
    const cached = getCachedRSS(url);
    if (cached && cached.length > 0) {
      return cached;
    }
  }

  let xmlText = null;
  let lastError = null;

  // Tier 1a: Same-origin proxy endpoint (/api/feed?url=...)
  try {
    const proxyUrl = `/api/feed?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, {
      headers: {
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
    });
    if (res.ok) {
      const text = await res.text();
      if (text && (text.includes('<rss') || text.includes('<feed') || text.includes('<item'))) {
        xmlText = text;
      }
    } else {
      lastError = new Error(`Proxy /api/feed returned HTTP ${res.status}`);
    }
  } catch (err) {
    lastError = err;
  }

  // Tier 1b: Same-origin /api/hashnode proxy endpoint
  if (!xmlText) {
    try {
      const res = await fetch(`/api/hashnode?url=${encodeURIComponent(url)}`, {
        headers: {
          Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
      });
      if (res.ok) {
        const text = await res.text();
        if (text && (text.includes('<rss') || text.includes('<feed') || text.includes('<item'))) {
          xmlText = text;
        }
      }
    } catch {
      // Proceed to next tier
    }
  }

  // Tier 2: Direct fetch to RSS endpoint
  if (!xmlText) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
      });
      if (res.ok) {
        const text = await res.text();
        if (text && (text.includes('<rss') || text.includes('<feed') || text.includes('<item'))) {
          xmlText = text;
        }
      } else {
        lastError = new Error(`Direct fetch to ${url} returned HTTP ${res.status}`);
      }
    } catch (directErr) {
      lastError = directErr;
    }
  }

  // Tier 3: Public CORS proxy fallbacks
  if (!xmlText) {
    const publicProxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
    ];

    for (const proxyEndpoint of publicProxies) {
      try {
        const res = await fetch(proxyEndpoint, {
          headers: {
            Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
          },
        });
        if (res.ok) {
          const text = await res.text();
          if (text && (text.includes('<rss') || text.includes('<feed') || text.includes('<item'))) {
            xmlText = text;
            break;
          }
        }
      } catch {
        // Try next proxy
      }
    }
  }

  if (!xmlText) {
    const errorMsg =
      lastError instanceof TypeError
        ? `Browser CORS or network policy prevented direct connection to ${url}. Please retry sync or load the offline archive.`
        : lastError?.message || `Failed to fetch RSS feed from ${url}.`;
    throw new Error(errorMsg);
  }

  const articles = parseHashnodeRSS(xmlText);
  if (!articles || articles.length === 0) {
    throw new Error(`Feed from ${url} contained no articles.`);
  }

  setCachedRSS(url, articles);
  return articles;
}

/**
 * Backward-compatible alias for fetchHashnodeRSS.
 * Accepts legacy options { host, url, forceRefresh }.
 */
export async function fetchHashnodeArticles(options = {}) {
  let feedUrl = options?.url;
  if (!feedUrl && options?.host) {
    feedUrl = `https://${options.host}/rss.xml`;
  }
  return fetchHashnodeRSS({
    url: feedUrl || DEFAULT_FEED_URL,
    forceRefresh: options?.forceRefresh ?? false,
  });
}
